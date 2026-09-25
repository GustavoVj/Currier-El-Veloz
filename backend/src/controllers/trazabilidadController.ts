import { type Request, type Response } from 'express';
import pool from '../config/db.js';

export const reporteTrazabilidad = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fechaInicio, fechaFin, codigo_guia } = req.query;

        let query = `
            SELECT h.id_movimiento, h.estado_movimiento, h.fecha_hora,
                   e.codigo_guia, 
                   p_emp.nombre_completo AS empleado,
                   rem.nombre_completo AS remitente,
                   des.nombre_completo AS destinatario
            FROM historial_movimiento h
            JOIN encomienda e ON h.id_encomienda = e.id_encomienda
            JOIN empleado emp ON h.id_empleado = emp.id_empleado
            JOIN persona p_emp ON emp.id_persona = p_emp.id_persona
            JOIN persona rem ON e.id_remitente = rem.id_persona
            JOIN persona des ON e.id_destinatario = des.id_persona
            WHERE 1=1
        `;
        
        const params: any[] = [];

        // Filtro por rango de fechas (si el administrador las envía)
        if (fechaInicio && fechaFin) {
            query += ` AND DATE(h.fecha_hora) BETWEEN ? AND ?`;
            params.push(fechaInicio, fechaFin);
        }

        // Filtro rápido por código de guía
        if (codigo_guia) {
            query += ` AND e.codigo_guia LIKE ?`;
            params.push(`%${codigo_guia}%`);
        }

        // Ordenar del más reciente al más antiguo, límite de seguridad para no saturar
        query += ` ORDER BY h.fecha_hora DESC LIMIT 200`;

        const [reporte] = await pool.query(query, params);
        res.json(reporte);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al generar el reporte de trazabilidad' });
    }
};