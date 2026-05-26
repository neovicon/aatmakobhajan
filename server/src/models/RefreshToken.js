import mongoose from 'mongoose';
import crypto from 'crypto';

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  revokedAt: {
    type: Date
  },
  replacedByToken: {
    type: String
  },
  createdByIp: String
}, {
  timestamps: true
});

// Virtual to check if token is expired
refreshTokenSchema.virtual('isExpired').get(function() {
  return Date.now() >= this.expiresAt;
});

// Virtual to check if token is active (not revoked, not expired)
refreshTokenSchema.virtual('isActive').get(function() {
  return !this.revokedAt && !this.isExpired;
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
export default RefreshToken;
