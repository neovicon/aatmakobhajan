import User from '../models/User.js';
import Song from '../models/Song.js';
import AuditLog from '../models/AuditLog.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAnalytics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalSongs = await Song.countDocuments({ isDeleted: false });
  
  const songs = await Song.find({ isDeleted: false });
  const totalViews = songs.reduce((acc, song) => acc + song.viewCount, 0);
  const totalFavorites = songs.reduce((acc, song) => acc + song.favoriteCount, 0);

  // Get recent uploads (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentUploadsCount = await Song.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
    isDeleted: false
  });

  res.status(200).json(new ApiResponse(200, {
    totalUsers,
    totalSongs,
    totalViews,
    totalFavorites,
    recentUploadsCount
  }, 'Analytics fetched'));
});

export const getAuditLogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const logs = await AuditLog.find()
    .populate('admin', 'username email')
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);

  const total = await AuditLog.countDocuments();

  res.status(200).json(new ApiResponse(200, {
    logs,
    page,
    pages: Math.ceil(total / limit),
    total
  }, 'Audit logs fetched'));
});
