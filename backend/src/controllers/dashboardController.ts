import { type Request, type Response } from 'express';
import pool from '../config/db.js';

export const obtenerEstadisticas = async (req: Request, res: Response): Promise<void> => {
    try {
        // 1. Contar el total de clientes registrados
        const [clientes]: any = await pool.query('SELECT COUNT(*) AS total FROM PERSONA');
        
        // 2. Contar el total de encomiendas creadas
        const [encomiendas]: any = await pool.query('SELECT COUNT(*) AS total FROM ENCOMIENDA');
        
        // 3. Contar encomiendas listas para despacho (Las que ya tienen el estado_pago = 'Pagado')
        const [enTransito]: any = await pool.query("SELECT COUNT(*) AS total FROM ENCOMIENDA WHERE estado_pago = 'Pagado'");

        res.json({
            clientesAtendidos: clientes[0].total,
            encomiendasHoy: encomiendas[0].total, 
            enTransito: enTransito[0].total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener estadísticas del dashboard' });
    }
};