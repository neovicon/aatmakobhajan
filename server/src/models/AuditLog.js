import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'RESTORE', 'UPLOAD', 'LOGIN_FAILED']
  },
  targetType: {
    type: String,
    required: true,
    enum: ['SONG', 'USER', 'APP_INFO', 'MEDIA', 'AUTH']
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    // Can be mixed depending on targetType, so not ref strictly unless populated dynamically
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: { createdAt: 'timestamp', updatedAt: false }
});

// Index for easier querying of logs
auditLogSchema.index({ admin: 1, timestamp: -1 });
auditLogSchema.index({ targetType: 1, targetId: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
