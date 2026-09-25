import { Router } from 'express';
import { obtenerPendientesCobro, registrarCobro } from '../controllers/cajaController.js';

const router = Router();

router.get('/pendientes', obtenerPendientesCobro);
router.post('/cobrar', registrarCobro);

export default router;