import { Router } from 'express';
import { obtenerEstadisticas } from '../controllers/dashboardController.js';

const router = Router();

router.get('/stats', obtenerEstadisticas);

export default router;