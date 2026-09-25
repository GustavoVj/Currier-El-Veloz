import { type Request, type Response } from 'express';
import pool from '../config/db.js';

export const registrarPago = async (req: Request, res: Response): Promise<void> => {
    // Abrimos una transacción porque tocaremos 3 tablas distintas
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const { id_encomienda, id_empleado_caja, monto_cobrado } = req.body;

        // 1. Verificar que la encomienda exista y no esté pagada ya
        const [encomiendaRows]: any = await connection.query(
            'SELECT monto_total, estado_pago FROM ENCOMIENDA WHERE id_encomienda = ?', 
            [id_encomienda]
        );

        if (encomiendaRows.length === 0) {
            res.status(404).json({ mensaje: 'Encomienda no encontrada' });
            return;
        }

        const encomienda = encomiendaRows[0];

        if (encomienda.estado_pago === 'Pagado') {
            res.status(400).json({ mensaje: 'Esta encomienda ya fue pagada anteriormente.' });
            return;
        }

        // Validación de seguridad: Que el cliente no pague menos de lo debido
        if (parseFloat(monto_cobrado) < parseFloat(encomienda.monto_total)) {
            res.status(400).json({ 
                mensaje: `Monto insuficiente. El total a pagar es: ${encomienda.monto_total} Bs.` 
            });
            return;
        }

        // 2. Insertar el recibo en la tabla PAGO
        await connection.query(`
            INSERT INTO PAGO (id_encomienda, id_empleado_caja, monto_cobrado) 
            VALUES (?, ?, ?)
        `, [id_encomienda, id_empleado_caja, monto_cobrado]);

        // 3. Actualizar el estado de la encomienda a "Pagado"
        await connection.query(`
            UPDATE ENCOMIENDA SET estado_pago = 'Pagado' WHERE id_encomienda = ?
        `, [id_encomienda]);

        // 4. Registrar en la trazabilidad que ya se puede subir al camión
        await connection.query(`
            INSERT INTO HISTORIAL_MOVIMIENTO (id_encomienda, id_empleado, estado_movimiento) 
            VALUES (?, ?, 'Pago Realizado - Listo para Despacho')
        `, [id_encomienda, id_empleado_caja]);

        // Confirmamos y guardamos la transacción
        await connection.commit();

        res.status(201).json({ 
            mensaje: 'Pago registrado exitosamente. La encomienda está liberada para tránsito.' 
        });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno al registrar el pago' });
    } finally {
        connection.release();
    }
};