import { type Request, type Response } from 'express';
import pool from '../config/db.js';

// Buscar persona por Carnet de Identidad
export const buscarClientePorCI = async (req: Request, res: Response): Promise<void> => {
    try {
        const { ci } = req.params;
        const [rows]: any = await pool.query('SELECT * FROM PERSONA WHERE ci = ?', [ci]);

        if (rows.length === 0) {
            res.status(404).json({ mensaje: 'Cliente no encontrado. Debe registrarse.' });
            return;
        }

        res.json({ cliente: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al buscar el cliente' });
    }
};

// Registrar un nuevo cliente
export const registrarCliente = async (req: Request, res: Response): Promise<void> => {
    try {
        const { ci, nombre_completo, telefono } = req.body;

        // Verificar si ya existe para evitar errores de clave duplicada
        const [existente]: any = await pool.query('SELECT id_persona FROM PERSONA WHERE ci = ?', [ci]);
        if (existente.length > 0) {
            res.status(400).json({ mensaje: 'Ya existe un cliente registrado con este CI' });
            return;
        }

        const [resultado]: any = await pool.query(
            'INSERT INTO PERSONA (ci, nombre_completo, telefono) VALUES (?, ?, ?)',
            [ci, nombre_completo, telefono]
        );

        res.status(201).json({ 
            mensaje: 'Cliente registrado exitosamente',
            id_persona: resultado.insertId 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al registrar el cliente' });
    }
};