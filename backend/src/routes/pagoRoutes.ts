import { Router } from 'express';
import { registrarPago } from '../controllers/pagoController.js';

const router = Router();

router.post('/', registrarPago);

export default router;