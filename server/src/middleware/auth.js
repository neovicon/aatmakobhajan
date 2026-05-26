import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import TokenService from '../services/token.service.js';
import User from '../models/User.js';

export const requireAuth = asyncHandler(async (req, res, next) => {
  let token;

  console.log('requireAuth: req.headers.authorization =', req.headers.authorization);

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    console.log('requireAuth: No token found in request headers');
    throw new ApiError(401, 'Not authorized to access this route');
  }

  try {
    // Verify token
    console.log('requireAuth: Verifying token =', token);
    const decoded = TokenService.verifyAccessToken(token);
    console.log('requireAuth: Decoded token payload =', decoded);

    // Get user from token
    const user = await User.findById(decoded.id);

    if (!user) {
      console.log('requireAuth: User not found in DB for ID =', decoded.id);
      throw new ApiError(401, 'The user belonging to this token does no longer exist.');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error('requireAuth: Verification error =', err);
    throw new ApiError(401, 'Not authorized, token failed or expired');
  }
});

export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    next(new ApiError(403, 'Not authorized as an admin'));
  }
};
