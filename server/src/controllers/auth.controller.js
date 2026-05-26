import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';
import AuditLog from '../models/AuditLog.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import TokenService from '../services/token.service.js';

// Setup cookie options
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    throw new ApiError(400, 'User already exists');
  }

  // Determine role based on first user
  const isFirstUser = (await User.countDocuments({})) === 0;
  const role = isFirstUser ? 'admin' : 'user';

  const user = await User.create({
    username,
    email,
    password,
    role
  });

  const accessToken = TokenService.generateAccessToken(user);
  const refreshToken = await TokenService.generateRefreshToken(user, req.ip);

  res.cookie('jwt', refreshToken.token, getCookieOptions());

  res.status(201).json(new ApiResponse(201, {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    accessToken
  }, 'User registered successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Check if account is locked
  if (user.isLocked) {
    throw new ApiError(403, `Account locked. Try again later.`);
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 mins
      
      if (user.role === 'admin') {
        await AuditLog.create({
          admin: user._id,
          action: 'LOGIN_FAILED',
          targetType: 'AUTH',
          targetId: user._id,
          ipAddress: req.ip,
          details: { reason: 'Max login attempts reached' }
        });
      }
    }
    await user.save({ validateBeforeSave: false });
    throw new ApiError(401, 'Invalid credentials');
  }

  // Reset failed attempts on success
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  await user.save({ validateBeforeSave: false });

  const accessToken = TokenService.generateAccessToken(user);
  const refreshToken = await TokenService.generateRefreshToken(user, req.ip);

  res.cookie('jwt', refreshToken.token, getCookieOptions());

  res.status(200).json(new ApiResponse(200, {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage,
    accessToken
  }, 'Logged in successfully'));
});

export const refresh = asyncHandler(async (req, res) => {
  const cookieToken = req.cookies.jwt;

  if (!cookieToken) {
    throw new ApiError(401, 'No refresh token provided');
  }

  const refreshToken = await RefreshToken.findOne({ token: cookieToken }).populate('user');

  if (!refreshToken) {
    // If token not found, it might be reused maliciously. We could implement reuse detection here.
    res.clearCookie('jwt');
    throw new ApiError(401, 'Invalid refresh token');
  }

  if (!refreshToken.isActive) {
    res.clearCookie('jwt');
    throw new ApiError(401, 'Refresh token expired or revoked');
  }

  // Revoke old token
  refreshToken.revokedAt = new Date();
  await refreshToken.save();

  // Generate new tokens
  const newRefreshToken = await TokenService.generateRefreshToken(refreshToken.user, req.ip);
  const accessToken = TokenService.generateAccessToken(refreshToken.user);

  res.cookie('jwt', newRefreshToken.token, getCookieOptions());

  res.status(200).json(new ApiResponse(200, {
    accessToken
  }, 'Token refreshed'));
});

export const logout = asyncHandler(async (req, res) => {
  const cookieToken = req.cookies.jwt;
  
  if (cookieToken) {
    await RefreshToken.findOneAndUpdate(
      { token: cookieToken },
      { revokedAt: new Date() }
    );
  }

  res.clearCookie('jwt');
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites', 'title slug artist coverImage');
  res.status(200).json(new ApiResponse(200, user, 'User details fetched'));
});
