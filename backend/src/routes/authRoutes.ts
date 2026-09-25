import { Router } from 'express';
import { login, crearUsuarioPrueba } from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.post('/test-register', crearUsuarioPrueba);

export default router;