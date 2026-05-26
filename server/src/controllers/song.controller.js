import Song from '../models/Song.js';
import AuditLog from '../models/AuditLog.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateUniqueSlug } from '../utils/slugify.js';

export const getSongs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query = {};
  if (req.query.category) query.category = req.query.category;
  if (req.query.tags) {
    const tags = Array.isArray(req.query.tags)
      ? req.query.tags
      : req.query.tags.split(',').filter(Boolean);
    query.tags = { $in: tags };
  }
  
  const songs = await Song.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-history'); // exclude history in list

  const total = await Song.countDocuments(query);

  res.status(200).json(new ApiResponse(200, {
    songs,
    page,
    pages: Math.ceil(total / limit),
    total
  }, 'Songs fetched'));
});

export const getSongBySlug = asyncHandler(async (req, res) => {
  const song = await Song.findOne({ slug: req.params.slug });

  if (!song) {
    throw new ApiError(404, 'Song not found');
  }

  // Increment view count
  song.viewCount += 1;
  await song.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, song, 'Song fetched'));
});

export const getTags = asyncHandler(async (req, res) => {
  const tags = await Song.distinct('tags');
  res.status(200).json(new ApiResponse(200, tags, 'Tags fetched'));
});

export const searchSongs = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!q) {
    return res.status(200).json(new ApiResponse(200, { songs: [], total: 0 }, 'Empty query'));
  }

  const regexQuery = new RegExp(q, 'i');
  // Base query with regex search for partial matching
  const query = {
    $or: [
      { title: regexQuery },
      { artist: regexQuery },
      { writer: regexQuery },
      { nepaliLyrics: regexQuery },
      { romanizedLyrics: regexQuery },
      { tags: regexQuery }
    ]
  };

  // Add category filtering if provided
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Add tags filtering if provided
  if (req.query.tags) {
    const tags = Array.isArray(req.query.tags)
      ? req.query.tags
      : req.query.tags.split(',').filter(Boolean);
    query.tags = { $in: tags };
  }

  const songs = await Song.find(query)
    .sort({ viewCount: -1 })
    .skip(skip)
    .limit(limit)
    .select('-history');

  const total = await Song.countDocuments(query);

  res.status(200).json(new ApiResponse(200, {
    songs,
    page,
    pages: Math.ceil(total / limit),
    total
  }, 'Search results fetched'));
});

export const createSong = asyncHandler(async (req, res) => {
  const slug = await generateUniqueSlug(Song, req.body.title);
  
  const song = await Song.create({
    ...req.body,
    slug,
    createdBy: req.user._id,
    history: [{
      nepaliLyrics: req.body.nepaliLyrics,
      romanizedLyrics: req.body.romanizedLyrics
    }]
  });

  await AuditLog.create({
    admin: req.user._id,
    action: 'CREATE',
    targetType: 'SONG',
    targetId: song._id,
    ipAddress: req.ip
  });

  res.status(201).json(new ApiResponse(201, song, 'Song created successfully'));
});

export const updateSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id);

  if (!song) {
    throw new ApiError(404, 'Song not found');
  }

  // Handle lyrics history if lyrics are updated
  if (req.body.nepaliLyrics || req.body.romanizedLyrics) {
    const nep = req.body.nepaliLyrics || song.nepaliLyrics;
    const rom = req.body.romanizedLyrics || song.romanizedLyrics;
    
    // Only add to history if it actually changed
    if (nep !== song.nepaliLyrics || rom !== song.romanizedLyrics) {
      song.history.push({
        nepaliLyrics: song.nepaliLyrics,
        romanizedLyrics: song.romanizedLyrics
      });
    }
  }

  // Update fields
  Object.keys(req.body).forEach(key => {
    song[key] = req.body[key];
  });
  
  // If title changed, update slug
  if (req.body.title && req.body.title !== song.title) {
    song.slug = await generateUniqueSlug(Song, req.body.title);
  }

  await song.save();

  await AuditLog.create({
    admin: req.user._id,
    action: 'UPDATE',
    targetType: 'SONG',
    targetId: song._id,
    ipAddress: req.ip
  });

  res.status(200).json(new ApiResponse(200, song, 'Song updated successfully'));
});

export const deleteSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id);

  if (!song) {
    throw new ApiError(404, 'Song not found');
  }

  // Soft delete
  song.isDeleted = true;
  song.deletedAt = new Date();
  await song.save();

  await AuditLog.create({
    admin: req.user._id,
    action: 'DELETE',
    targetType: 'SONG',
    targetId: song._id,
    ipAddress: req.ip
  });

  res.status(200).json(new ApiResponse(200, null, 'Song deleted (soft) successfully'));
});

export const restoreSong = asyncHandler(async (req, res) => {
  // Pass { isDeleted: true } directly to findOne or bypass pre-find via some flag,
  // Since we did this in schema: if isDeleted is not in query, it filters them out.
  const song = await Song.findOne({ _id: req.params.id, isDeleted: true });

  if (!song) {
    throw new ApiError(404, 'Deleted song not found');
  }

  song.isDeleted = false;
  song.deletedAt = undefined;
  await song.save();

  await AuditLog.create({
    admin: req.user._id,
    action: 'RESTORE',
    targetType: 'SONG',
    targetId: song._id,
    ipAddress: req.ip
  });

  res.status(200).json(new ApiResponse(200, song, 'Song restored successfully'));
});

export const getTrendingSongs = asyncHandler(async (req, res) => {
  const songs = await Song.find({})
    .sort({ viewCount: -1 })
    .limit(10)
    .select('-history');
  res.status(200).json(new ApiResponse(200, songs, 'Trending songs fetched'));
});

export const getRecentSongs = asyncHandler(async (req, res) => {
  const songs = await Song.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .select('-history');
  res.status(200).json(new ApiResponse(200, songs, 'Recent songs fetched'));
});

export const syncSongs = asyncHandler(async (req, res) => {
  const { since } = req.query;
  const currentTimestamp = new Date();

  // If no timestamp is provided, we fetch everything except deleted
  let query = {};
  if (since) {
    query.updatedAt = { $gte: new Date(since) };
  }

  // Find all matching songs, overriding the default pre-find middleware by explicitly passing `isDeleted` if we want deleted ones
  // Our schema says if `isDeleted` is not in query, it filters out deleted. So to get ALL updated (including deleted), we bypass the filter.
  // Actually, pre-find explicitly checks `if (this.getQuery().isDeleted === undefined)`. 
  // By querying with `$exists: true` or `{ $in: [true, false] }`, we can bypass it.
  query.isDeleted = { $in: [true, false] };

  const songs = await Song.find(query).select('-history');

  const newSongs = [];
  const updatedSongs = [];
  const deletedIds = [];

  songs.forEach(song => {
    if (song.isDeleted) {
      deletedIds.push(song._id);
    } else if (!since || song.createdAt >= new Date(since)) {
      newSongs.push(song);
    } else {
      updatedSongs.push(song);
    }
  });

  res.status(200).json(new ApiResponse(200, {
    newSongs,
    updatedSongs,
    deletedIds,
    timestamp: currentTimestamp
  }, 'Sync successful'));
});
