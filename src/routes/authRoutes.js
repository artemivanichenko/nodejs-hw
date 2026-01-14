import { celebrate } from 'celebrate';
import { Router } from 'express';
import {
  createUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  requestResetPassSchema,
} from '../validations/authValidation.js';
import {
  login,
  logout,
  refreshSession,
  register,
  requestResetEmail,
  requestResetPass,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', celebrate(createUserSchema), register);
router.post('/login', celebrate(loginUserSchema), login);
router.post('/refresh', refreshSession);
router.post('/logout', logout);
router.post(
  '/request-reset-email',
  celebrate(requestResetEmailSchema),
  requestResetEmail,
);
router.post(
  '/reset-password',
  celebrate(requestResetPassSchema),
  requestResetPass,
);

export default router;
