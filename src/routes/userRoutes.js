import { Router } from 'express';
import { updateAvatar } from '../controllers/userController.js';
import { mediaParser } from '../middleware/multer.js';
import { authenticate } from '../middleware/authenticate.js';

const userRoutes = Router();
// userRoutes.use('/', authenticate);
userRoutes.patch(
  '/me/avatar',
  authenticate,
  mediaParser.single('avatar'),
  updateAvatar,
);

export default userRoutes;
