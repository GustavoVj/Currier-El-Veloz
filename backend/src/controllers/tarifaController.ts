import { type Request, type Response } from 'express';
import pool from '../config/db.js';

export const registrarTarifa = async (req: Request, res: Response): Promise<void> => {
    try {
        const { 
            id_origen, 
            id_destino, 
            id_forma_envio, 
            id_tipo_encomienda, 
            precio_base_kilo,
            fecha_vigencia,
            fecha_fin_vigencia, // <-- AÑADIDO AQUÍ
            estado
        } = req.body;

        const [resultado]: any = await pool.query(`
            INSERT INTO tarifa_envio 
            (id_origen, id_destino, id_forma_envio, id_tipo_encomienda, precio_base_kilo, fecha_vigencia, fecha_fin_vigencia, estado) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            id_origen, 
            id_destino, 
            id_forma_envio, 
            id_tipo_encomienda, 
            precio_base_kilo, 
            fecha_vigencia,
            fecha_fin_vigencia || null, // <-- AÑADIDO AQUÍ (Guarda NULL si viene vacío)
            estado || 'Activo'
        ]);

        res.status(201).json({ 
            mensaje: 'Tarifa registrada exitosamente',
            id_tarifa: resultado.insertId 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar la tarifa' });
    }
};

export const obtenerDatosTarifa = async (req: Request, res: Response): Promise<void> => {
    try {
        const [ciudades] = await pool.query('SELECT * FROM ciudad');
        const [formasEnvio] = await pool.query('SELECT * FROM forma_envio');
        const [tiposEncomienda] = await pool.query('SELECT * FROM tipo_encomienda');
        
        const [tarifas] = await pool.query(`
            SELECT 
    t.*, /* Esto es crucial: trae id_tarifa, id_origen, id_destino, etc. */
    c1.nombre AS origen, 
    c2.nombre AS destino, 
    fe.nombre AS forma_envio, 
    te.nombre AS tipo_encomienda
FROM tarifa_envio t
JOIN ciudad c1 ON t.id_origen = c1.id_ciudad
JOIN ciudad c2 ON t.id_destino = c2.id_ciudad
JOIN forma_envio fe ON t.id_forma_envio = fe.id_forma_envio
JOIN tipo_encomienda te ON t.id_tipo_encomienda = te.id_tipo_encomienda
        `);

        res.json({ ciudades, formasEnvio, tiposEncomienda, tarifas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al cargar los datos de tarifas' });
    }
};
export const actualizarTarifa = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params; // El ID de la tarifa a editar
        const { precio_base_kilo, fecha_vigencia, fecha_fin_vigencia, estado } = req.body;

        await pool.query(`
            UPDATE tarifa_envio 
            SET precio_base_kilo = ?, fecha_vigencia = ?, fecha_fin_vigencia = ?, estado = ?
            WHERE id_tarifa = ?
        `, [precio_base_kilo, fecha_vigencia, fecha_fin_vigencia || null, estado, id]);

        res.json({ mensaje: 'Tarifa actualizada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar la tarifa' });
    }
};