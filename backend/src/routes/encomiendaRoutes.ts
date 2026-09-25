import { Router } from 'express';
import { obtenerDatosRecepcion, registrarEncomienda } from '../controllers/encomiendaController.js';

const router = Router();

router.get('/config', obtenerDatosRecepcion);
router.post('/', registrarEncomienda);

export default router;