import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { protect } from '../middlewares/auth.middleware';
import { uploadAvatar } from '../middlewares/upload.middleware';
import { registerSchema, loginSchema, refreshTokenSchema } from '../validations/auth.validation';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshTokenSchema), authController.refresh);

// Protected routes
router.use(protect);
router.get('/me', authController.getMe);
router.put('/profile', authController.updateProfile);
router.put('/password', authController.updatePassword);
router.post('/avatar', uploadAvatar.single('avatar'), authController.uploadUserAvatar);

export default router;