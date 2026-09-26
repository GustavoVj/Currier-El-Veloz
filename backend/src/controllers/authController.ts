import { type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;
        // 1. Buscar el usuario en la BD (Agregamos e.id_empleado a la consulta)
        const [rows]: any = await pool.query(`
            SELECT u.id_usuario, u.password_hash, c.nombre_cargo AS rol, p.nombre_completo, e.id_empleado
            FROM USUARIO u
            INNER JOIN EMPLEADO e ON u.id_empleado = e.id_empleado
            INNER JOIN CARGO c ON e.id_cargo = c.id_cargo
            INNER JOIN PERSONA p ON e.id_persona = p.id_persona
            WHERE u.username = ?
        `, [username]);

        if (rows.length === 0) {
            res.status(401).json({ mensaje: 'Credenciales inválidas' });
            return;
        }

        const usuario = rows[0];

        // 2. Verificar la contraseña encriptada
        const passwordValida = await bcrypt.compare(password, usuario.password_hash);
        if (!passwordValida) {
            res.status(401).json({ mensaje: 'Credenciales inválidas' });
            return;
        }

        // 3. Generar el Token (JWT)
        const token = jwt.sign(
            { id_usuario: usuario.id_usuario, rol: usuario.rol }, // <-- CORREGIDO: Usar usuario.rol
            process.env.JWT_SECRET as string,
            { expiresIn: '8h' }
        );

        res.json({ 
            token, 
            rol: usuario.rol,
            nombre: usuario.nombre_completo, // <-- CORREGIDO: Usar usuario.nombre_completo
            id_empleado: usuario.id_empleado
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
};

// Función temporal solo para que puedas crear tu primer acceso de prueba
export const crearUsuarioPrueba = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;
        
        // Encriptar la contraseña (Hash)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insertar datos en cadena (Cargo -> Persona -> Empleado -> Usuario)
        const [cargo]: any = await pool.query("INSERT INTO CARGO (nombre_cargo) VALUES ('Administrador')");
        const [persona]: any = await pool.query("INSERT INTO PERSONA (ci, nombre_completo) VALUES ('1234567', 'Gustavo Vaca')");
        const [empleado]: any = await pool.query("INSERT INTO EMPLEADO (id_persona, id_cargo) VALUES (?, ?)", [persona.insertId, cargo.insertId]);
        await pool.query("INSERT INTO USUARIO (id_empleado, username, password_hash) VALUES (?, ?, ?)", [empleado.insertId, username, passwordHash]);

        res.json({ mensaje: 'Usuario Administrador de prueba creado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al crear usuario' });
    }
};