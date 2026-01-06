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
  console.log('🔑 Starting Google OAuth flow...');
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  console.log('📍 Hit /google/callback route');
  console.log('🔄 Processing Google OAuth callback...');
  next();
}, 
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_auth_failed`
  }),
  AuthController.googleCallback
);

// Protected routes (authentication required)
router.get('/me', authenticate, AuthController.me);

console.log('✅ Auth routes configured');

export const authRoutes = router;
