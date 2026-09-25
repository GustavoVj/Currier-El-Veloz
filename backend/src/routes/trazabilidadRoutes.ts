import { Router } from 'express';
import { reporteTrazabilidad } from '../controllers/trazabilidadController.js';

const router = Router();

router.get('/reporte', reporteTrazabilidad);

export default router;