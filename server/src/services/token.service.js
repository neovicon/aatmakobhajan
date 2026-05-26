import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import RefreshToken from '../models/RefreshToken.js';

class TokenService {
  /**
   * Generate access token
   * @param {Object} user - User object
   * @returns {String} JWT access token
   */
  static generateAccessToken(user) {
    return jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' }
    );
  }

  /**
   * Generate refresh token
   * @param {Object} user - User object
   * @param {String} ipAddress - Client IP address
   * @returns {Object} Refresh token object
   */
  static async generateRefreshToken(user, ipAddress) {
    // create a random token
    const token = crypto.randomBytes(40).toString('hex');
    
    // expiry based on env or default 7 days
    const expiresIn = process.env.JWT_REFRESH_EXPIRATION || '7d';
    const days = parseInt(expiresIn.replace('d', '')) || 7;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const refreshToken = await RefreshToken.create({
      token,
      user: user._id,
      expiresAt,
      createdByIp: ipAddress
    });

    return refreshToken;
  }

  /**
   * Verify access token
   * @param {String} token 
   * @returns {Object} Decoded payload
   */
  static verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  }
}

export default TokenService;
