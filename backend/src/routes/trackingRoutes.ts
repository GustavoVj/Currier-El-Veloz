import { Router } from 'express';
import { consultarGuiaTracking, actualizarEstadoDespacho } from '../controllers/trackingController.js';

const router = Router();

router.get('/:codigo', consultarGuiaTracking);
router.post('/actualizar', actualizarEstadoDespacho);

export default router;