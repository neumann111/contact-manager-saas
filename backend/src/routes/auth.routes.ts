import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { protect } from '../middlewares/auth.middleware';
import { uploadAvatar } from '../middlewares/upload.middleware';
import { 
  registerSchema, 
  loginSchema, 
  refreshTokenSchema,
  resetPasswordSchema,
  updatePasswordSchema
} from '../validations/auth.validation';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshTokenSchema), authController.refresh);

router.post('/forgot-password', authController.forgotPassword);
// ADDED VALIDATION HERE:
router.patch('/reset-password/:token', validate(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.use(protect);
router.get('/me', authController.getMe);
router.put('/profile', authController.updateProfile);
// ADDED VALIDATION HERE:
router.put('/password', validate(updatePasswordSchema), authController.updatePassword);
router.post('/avatar', uploadAvatar.single('avatar'), authController.uploadUserAvatar);

export default router;