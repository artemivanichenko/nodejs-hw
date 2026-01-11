import { celebrate } from 'celebrate';
import { Router } from 'express';
import {
  createUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';
import {
  login,
  logout,
  refreshSession,
  register,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', celebrate(createUserSchema), register);
router.post('/login', celebrate(loginUserSchema), login);
router.post('/refresh', refreshSession);
router.post('/logout', logout);

export default router;
