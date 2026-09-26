import { type Request, type Response } from 'express';
import pool from '../config/db.js';

// 1. Consultar el estado actual y detalles de una encomienda por su código de guía
export const consultarGuiaTracking = async (req: Request, res: Response): Promise<void> => {
    try {
        const { codigo } = req.params;
        const [encomiendaRows]: any = await pool.query(`
            SELECT e.*, 
                   rem.nombre_completo AS remitente, rem.ci AS ci_remitente,
                   des.nombre_completo AS destinatario, des.ci AS ci_destinatario,
                   mp.nombre AS modalidad_pago
            FROM encomienda e
            JOIN persona rem ON e.id_remitente = rem.id_persona
            JOIN persona des ON e.id_destinatario = des.id_persona
            JOIN modalidad_pago mp ON e.id_modalidad = mp.id_modalidad
            WHERE e.codigo_guia = ?
        `, [codigo]);

        if (encomiendaRows.length === 0) {
            res.status(404).json({ mensaje: 'No se encontró ninguna encomienda con ese código de guía.' });
            return;
        }

        const encomienda = encomiendaRows[0];

        // Obtener la línea de tiempo de movimientos usando estado_movimiento
        const [historial]: any = await pool.query(`
            SELECT h.*, emp.id_empleado, p_emp.nombre_completo AS empleado
            FROM historial_movimiento h
            JOIN empleado emp ON h.id_empleado = emp.id_empleado
            JOIN persona p_emp ON emp.id_persona = p_emp.id_persona
            WHERE h.id_encomienda = ?
            ORDER BY h.fecha_hora ASC
        `, [encomienda.id_encomienda]);

        // Formateamos la respuesta EXACTAMENTE como la espera el Frontend (Tracking.tsx)
        res.json({
            encomienda,  // Requerido por Despacho.tsx
            historial,   // Requerido por Despacho.tsx
            codigo_guia: encomienda.codigo_guia, // Requerido por Tracking.tsx
            movimientos: historial.map((h: any) => ({ // Requerido por Tracking.tsx
                estado_movimiento: h.estado_movimiento,
                fecha_hora: h.fecha_hora,
                registrado_por: h.empleado
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al consultar la guía de tracking' });
    }
};

// 2. Actualizar el estado logístico aplicando la Máquina de Estados y Bloqueo Financiero (HU6)
export const actualizarEstadoDespacho = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_encomienda, nuevo_estado, id_empleado, ci_destinatario_verificacion } = req.body;

        // Obtener datos actuales de la encomienda y su último movimiento
        const [encRows]: any = await pool.query(`
            SELECT e.*, mp.nombre AS modalidad_pago,
                   (SELECT estado_movimiento FROM historial_movimiento WHERE id_encomienda = e.id_encomienda ORDER BY fecha_hora DESC LIMIT 1) AS estado_actual,
                   des.ci AS ci_real_destinatario
            FROM encomienda e
            JOIN modalidad_pago mp ON e.id_modalidad = mp.id_modalidad
            JOIN persona des ON e.id_destinatario = des.id_persona
            WHERE e.id_encomienda = ?
        `, [id_encomienda]);

        if (encRows.length === 0) {
            res.status(404).json({ mensaje: 'Encomienda no encontrada.' });
            return;
        }

        const enc = encRows[0];

        // REGLA 1: Máquina de Estados Secuencial Estricta

        // 1.1 Bloqueo para Salida (En Tránsito)
        if (nuevo_estado === 'En Tránsito' && enc.estado_actual !== 'Registrado - Recepción en origen' && enc.estado_actual !== 'Pago consolidado en Caja') {
            res.status(400).json({ 
                mensaje: 'Bloqueo de Secuencia: Para enviar a ruta (En Tránsito), el paquete debe estar recién Registrado o Pagado en origen.' 
            });
            return;
        }

        // 1.2 Bloqueo para Llegada (Llegada a Destino)
        if (nuevo_estado === 'Llegada a Destino' && enc.estado_actual !== 'En Tránsito') {
            res.status(400).json({ 
                mensaje: 'Bloqueo de Secuencia: El paquete debe estar "En Tránsito" antes de poder registrar su Llegada a Destino.' 
            });
            return;
        }

        // 1.3 Bloqueo para Entrega Final (Entregado)
        if (nuevo_estado === 'Entregado' && enc.estado_actual !== 'Llegada a Destino' && enc.estado_actual !== 'Pago consolidado en Caja') {
            res.status(400).json({ 
                mensaje: 'Bloqueo de Secuencia: No se puede entregar un paquete que no ha registrado su "Llegada a Destino".' 
            });
            return;
        }

        // REGLA 2: Bloqueo Financiero Integral

        // 2.1 CANDADO PARA PAGO EN ORIGEN:
        // No puede avanzar a ningún estado operativo si el remitente no pagó en caja
        if (enc.modalidad_pago.includes('Origen') && enc.estado_pago !== 'Pagado') {
            res.status(400).json({ 
                mensaje: 'Bloqueo Financiero: Esta encomienda es "Pago en Origen" y aún figura PENDIENTE en caja. No puede salir a ruta ni actualizar su estado.' 
            });
            return;
        }

        // 2.2 CANDADO PARA PAGO EN DESTINO:
        // No puede entregarse al cliente final si no canceló previamente en caja de destino
        if (nuevo_estado === 'Entregado' && enc.modalidad_pago.includes('Destino') && enc.estado_pago !== 'Pagado') {
            res.status(400).json({ 
                mensaje: 'Bloqueo Financiero: Este paquete es "Pago en Destino" y no registra un cobro consolidado en caja.' 
            });
            return;
        }

        // REGLA 3: Verificación física de identidad del destinatario
        if (nuevo_estado === 'Entregado') {
            if (ci_destinatario_verificacion !== enc.ci_real_destinatario) {
                res.status(400).json({ mensaje: 'Error de Identidad: El CI del destinatario verificado físicamente no coincide con el registrado.' });
                return;
            }
        }

        // Registrar el hito inmutable con estampa de tiempo del servidor
        await pool.query(`
            INSERT INTO historial_movimiento (id_encomienda, id_empleado, estado_movimiento) 
            VALUES (?, ?, ?)
        `, [id_encomienda, id_empleado || 1, nuevo_estado]);

        res.json({ mensaje: `Estado actualizado exitosamente a: ${nuevo_estado}` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar el estado logístico' });
    }
};