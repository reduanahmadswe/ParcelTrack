import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validation';
import { createUserValidation, loginValidation } from '../user/user.validation';
import { AuthController } from './auth.controller';
import passport from '../../config/passport';

const router = Router();

console.log('🔧 Setting up auth routes...');

// Public routes (no authentication required)
router.post('/register', validateRequest(createUserValidation), AuthController.register);
router.post('/login', validateRequest(loginValidation), AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/refresh-token', AuthController.refreshToken);

// Google OAuth routes
console.log('🔧 Registering Google OAuth routes...');
router.get('/google', (req, res, next) => {
  console.log('📍 Hit /google route');
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  AuthController.googleCallback
);

// Protected routes (authentication required)
router.get('/me', authenticate, AuthController.me);

console.log('✅ Auth routes configured');

export const authRoutes = router;
