import User from '../models/User.js';
import Song from '../models/Song.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const toggleFavorite = asyncHandler(async (req, res) => {
  const songId = req.params.songId;
  
  const song = await Song.findById(songId);
  if (!song) {
    throw new ApiError(404, 'Song not found');
  }

  const user = await User.findById(req.user._id);
  
  const index = user.favorites.indexOf(songId);
  
  if (index === -1) {
    user.favorites.push(songId);
    song.favoriteCount += 1;
  } else {
    user.favorites.splice(index, 1);
    song.favoriteCount = Math.max(0, song.favoriteCount - 1);
  }

  await user.save({ validateBeforeSave: false });
  await song.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, {
    favorites: user.favorites,
    favoriteCount: song.favoriteCount
  }, 'Favorites updated'));
});

export const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites', 'title slug artist coverImage category');
  
  res.status(200).json(new ApiResponse(200, user.favorites, 'Favorites fetched successfully'));
});

// Admin only: List all users
export const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments();

  res.status(200).json(new ApiResponse(200, {
    users,
    page,
    pages: Math.ceil(total / limit),
    total
  }, 'Users fetched'));
});
