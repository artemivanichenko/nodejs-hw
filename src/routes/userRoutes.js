import { Router } from 'express';
import { updateAvatar } from '../controllers/userController.js';
import { MediaParser } from '../middleware/multer.js';
import { authenticate } from '../middleware/authenticate.js';

const userRoutes = Router();

// userRoutes.use('/', authenticate);
userRoutes.patch(
  '/me/avatar',
  authenticate,
  MediaParser.single('avatar'),
  updateAvatar,
);

export default userRoutes;
