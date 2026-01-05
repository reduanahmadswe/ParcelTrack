/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { clearAuthCookies, setAuthCookie } from '../../utils/authTokens';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AuthService } from './auth.service';
import { createUserTokens } from '../../utils/helpers';

export class AuthController {
  // Register new user
  static register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;
    const result = await AuthService.register(userData);

    // Set tokens in cookies
    setAuthCookie(res, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    sendResponse(res, {
      statuscode: 201,
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  });

  // Login user
  static login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginData = req.body;
    const result = await AuthService.login(loginData);

    // Set tokens in cookies
    setAuthCookie(res, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    sendResponse(res, {
      statuscode: 200,
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  });

  // Logout user
  static logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    clearAuthCookies(res);
    sendResponse(res, {
      statuscode: 200,
      success: true,
      message: 'Logout successful',
      data: null,
    });
  });

  // Refresh token
  static refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return sendResponse(res, {
        statuscode: 401,
        success: false,
        message: 'Refresh token not provided',
        data: null,
      });
    }

    const result = await AuthService.refreshToken(refreshToken);

    // Set new access token in cookie
    setAuthCookie(res, {
      accessToken: result.accessToken,
    });

    sendResponse(res, {
      statuscode: 200,
      success: true,
      message: 'Token refreshed successfully',
      data: result,
    });
  });

  // Check authentication status
  static me = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    sendResponse(res, {
      statuscode: 200,
      success: true,
      message: 'User authenticated',
      data: {
        user: (req as any).user,
      },
    });
  });

  // Google OAuth callback
  static googleCallback = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;
    
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=auth_failed`);
    }

    // Generate tokens
    const tokens = createUserTokens({
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Set tokens in cookies
    setAuthCookie(res, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    // Redirect to frontend with tokens and user data
    const userStr = encodeURIComponent(JSON.stringify({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }));
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/google/success?token=${tokens.accessToken}&refreshToken=${tokens.refreshToken}&user=${userStr}`;
    res.redirect(redirectUrl);
  });
}
