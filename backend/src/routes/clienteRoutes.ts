import { Router } from 'express';
import { buscarClientePorCI, registrarCliente } from '../controllers/clienteController.js';

const router = Router();

router.get('/:ci', buscarClientePorCI);
router.post('/', registrarCliente);

export default router;