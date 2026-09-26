import { type Request, type Response } from 'express';
import pool from '../config/db.js';

// 1. Obtener datos para llenar los menús desplegables del Frontend
export const obtenerDatosRecepcion = async (req: Request, res: Response): Promise<void> => {
    try {
        const [ciudades] = await pool.query('SELECT * FROM ciudad');
        const [formasEnvio] = await pool.query('SELECT * FROM forma_envio');
        const [tiposEncomienda] = await pool.query('SELECT * FROM tipo_encomienda');
        const [modalidadesPago] = await pool.query('SELECT * FROM modalidad_pago');
        const [tarifas] = await pool.query('SELECT * FROM tarifa_envio WHERE estado = "Activo"');

        res.json({ ciudades, formasEnvio, tiposEncomienda, modalidadesPago, tarifas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al cargar los catálogos operativos' });
    }
};

// 2. Procesar la Recepción (Reglas de Negocio HU5)
export const registrarEncomienda = async (req: Request, res: Response): Promise<void> => {
    try {
        const { 
            id_remitente, id_destinatario, id_tarifa, id_modalidad_pago, 
            peso, dimensiones, recargo_volumen, declaracion_legal, id_empleado 
        } = req.body;

        // Auditoría Legal
        if (!declaracion_legal) {
            res.status(400).json({ mensaje: 'Operación denegada: Debe confirmar la declaración de contenido.' });
            return;
        }

        // Obtener tarifa y precio base
        const [tarifaRows]: any = await pool.query('SELECT precio_base_kilo FROM tarifa_envio WHERE id_tarifa = ?', [id_tarifa]);
        
        if (tarifaRows.length === 0) {
            res.status(404).json({ mensaje: 'Error: La tarifa seleccionada no existe o está inactiva.' });
            return;
        }

        const precio_base = parseFloat(tarifaRows[0].precio_base_kilo);
        const recargo = parseFloat(recargo_volumen) || 0;
        const monto_total = (parseFloat(peso) * precio_base) + recargo;

        // Inserción adaptada exactamente a los nombres de tus columnas
        // Inserción adaptada a tus columnas (sin la columna 'estado')
        const [resultadoPaquete]: any = await pool.query(`
            INSERT INTO encomienda 
            (id_remitente, id_destinatario, id_tarifa, id_modalidad, peso_kg, volumen_m3, recargo_volumen, precio_base_aplicado, monto_total, descripcion_contenido) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Contenido verificado legalmente')
        `, [
            id_remitente, id_destinatario, id_tarifa, id_modalidad_pago, 
            peso, (dimensiones || null), recargo, precio_base, monto_total
        ]);

        const id_encomienda = resultadoPaquete.insertId;

        // Generación del Código de Guía Corporativo
        const codigo_guia = `VZ-2026-${String(id_encomienda).padStart(5, '0')}`;
        await pool.query('UPDATE encomienda SET codigo_guia = ? WHERE id_encomienda = ?', [codigo_guia, id_encomienda]);

        // Registrar el primer movimiento en el historial
        // Registrar el primer movimiento en el historial (sin la columna 'estado')
        await pool.query(`
            INSERT INTO historial_movimiento (id_encomienda, id_empleado, estado_movimiento) 
            VALUES (?, ?, 'Registrado - Recepción en origen')
        `, [id_encomienda, id_empleado]);

        res.status(201).json({ 
            mensaje: 'Encomienda procesada y tarificada exitosamente',
            codigo_guia: codigo_guia,
            monto_total: monto_total
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error crítico al registrar la encomienda' });
    }
};