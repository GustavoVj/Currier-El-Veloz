import { Router } from 'express';
import { obtenerDatosTarifa, registrarTarifa, actualizarTarifa } from '../controllers/tarifaController.js';

const router = Router();

router.get('/', obtenerDatosTarifa);
router.post('/', registrarTarifa);
router.put('/:id', actualizarTarifa);


export default router;