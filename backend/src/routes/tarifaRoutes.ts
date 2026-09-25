import { Router } from 'express';
import { obtenerDatosTarifa, registrarTarifa } from '../controllers/tarifaController.js';

const router = Router();

router.get('/', obtenerDatosTarifa);
router.post('/', registrarTarifa);

export default router;