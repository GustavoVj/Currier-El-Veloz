import { type Request, type Response } from 'express';
import pool from '../config/db.js';

// 1. Obtener la bandeja de encomiendas pendientes de cobro
export const obtenerPendientesCobro = async (req: Request, res: Response): Promise<void> => {
    try {
        const [pendientes] = await pool.query(`
            SELECT e.id_encomienda, e.codigo_guia, e.monto_total, e.estado_pago,
                   mp.nombre AS modalidad_pago,
                   rem.nombre_completo AS remitente,
                   des.nombre_completo AS destinatario
            FROM encomienda e
            JOIN modalidad_pago mp ON e.id_modalidad = mp.id_modalidad
            JOIN persona rem ON e.id_remitente = rem.id_persona
            JOIN persona des ON e.id_destinatario = des.id_persona
            WHERE e.estado_pago = 'Pendiente' OR e.estado_pago IS NULL
            ORDER BY e.id_encomienda DESC
        `);

        res.json(pendientes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al cargar la bandeja de caja' });
    }
};

// 2. Consolidar el pago de una encomienda
export const registrarCobro = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_encomienda, id_empleado_cajero } = req.body;

        // Actualizar el estado de pago en la encomienda
        await pool.query(`UPDATE encomienda SET estado_pago = 'Pagado' WHERE id_encomienda = ?`, [id_encomienda]);

        // Registrar el hito de pago en el historial de trazabilidad
        await pool.query(`
            INSERT INTO historial_movimiento (id_encomienda, id_empleado, estado_movimiento) 
            VALUES (?, ?, 'Pago consolidado en Caja')
        `, [id_encomienda, id_empleado_cajero || 1]);

        res.json({ mensaje: 'Cobro registrado y consolidado exitosamente en el sistema.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al procesar el cobro' });
    }
};