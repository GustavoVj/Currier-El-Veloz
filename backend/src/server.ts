// backend/src/server.ts
import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import tarifaRoutes from './routes/tarifaRoutes.js';
import encomiendaRoutes from './routes/encomiendaRoutes.js';
import pagoRoutes from './routes/pagoRoutes.js';
import trackingRoutes from './routes/trackingRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import cajaRoutes from './routes/cajaRoutes.js';
import trazabilidadRoutes from './routes/trazabilidadRoutes.js';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite peticiones desde tu Frontend en React
app.use(express.json()); // Permite recibir datos en formato JSON

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
    res.send('API de Currier La Veloz funcionando correctamente');
});

// Ruta para probar la conexión a MySQL
app.get('/api/test-db', async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS resultado');
        res.json({ mensaje: '¡Conexión exitosa a MySQL (XAMPP)!', data: rows });
    } catch (error) {
        console.error('Error conectando a la BD:', error);
        res.status(500).json({ error: 'Error interno del servidor de Base de Datos' });
    }
});
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/tarifas', tarifaRoutes);
app.use('/api/encomiendas', encomiendaRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/caja', cajaRoutes);
app.use('/api/trazabilidad', trazabilidadRoutes);
// Inicialización del servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log(`Prueba de BD en http://localhost:${port}/api/test-db`);
});