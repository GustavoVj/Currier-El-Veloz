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
            estado
        } = req.body;

        const [resultado]: any = await pool.query(`
            INSERT INTO tarifa_envio 
            (id_origen, id_destino, id_forma_envio, id_tipo_encomienda, precio_base_kilo, fecha_vigencia, estado) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            id_origen, 
            id_destino, 
            id_forma_envio, 
            id_tipo_encomienda, 
            precio_base_kilo, 
            fecha_vigencia,
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
            SELECT t.id_tarifa, o.nombre AS origen, d.nombre AS destino, 
                   f.nombre AS forma_envio, te.nombre AS tipo_encomienda, 
                   t.precio_base_kilo, t.fecha_vigencia, t.estado
            FROM tarifa_envio t
            JOIN ciudad o ON t.id_origen = o.id_ciudad
            JOIN ciudad d ON t.id_destino = d.id_ciudad
            JOIN forma_envio f ON t.id_forma_envio = f.id_forma_envio
            JOIN tipo_encomienda te ON t.id_tipo_encomienda = te.id_tipo_encomienda
            ORDER BY t.fecha_vigencia DESC
        `);

        res.json({ ciudades, formasEnvio, tiposEncomienda, tarifas });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al cargar los datos de tarifas' });
    }
};