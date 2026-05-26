import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

// Setup multer memory storage (we upload directly to Cloudinary from memory)
const storage = multer.memoryStorage();

// File filter based on type
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = {
    image: ['image/jpeg', 'image/png', 'image/webp'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/mp3'],
    video: ['video/mp4'] // Optional mp4 support
  };

  const fileType = req.baseUrl.includes('audio') ? 'audio' 
                 : req.baseUrl.includes('video') ? 'video' 
                 : 'image';

  if (allowedMimeTypes[fileType].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `Unsupported file format: ${file.mimetype}. Allowed: ${allowedMimeTypes[fileType].join(', ')}`), false);
  }
};

// Configurable upload limits
const limits = {
  image: 10 * 1024 * 1024, // 10MB
  audio: 50 * 1024 * 1024, // 50MB
  video: 200 * 1024 * 1024 // 200MB
};

const getLimit = (req) => {
  if (req.baseUrl.includes('audio')) return limits.audio;
  if (req.baseUrl.includes('video')) return limits.video;
  return limits.image;
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024 // Max overall limit, specific limits checked later if needed, but Multer limits are static per instance.
    // We can define separate multer instances for each if strict enforcement at multer level is needed.
  }
});

// Let's export specific instances for better limit enforcement
export const uploadImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, `Unsupported image format. Use JPG, PNG or WEBP.`), false);
    }
  },
  limits: { fileSize: limits.image }
});

export const uploadAudio = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (['audio/mpeg', 'audio/wav', 'audio/mp3'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, `Unsupported audio format. Use MP3 or WAV.`), false);
    }
  },
  limits: { fileSize: limits.audio }
});

export const uploadVideo = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (['video/mp4'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, `Unsupported video format. Use MP4.`), false);
    }
  },
  limits: { fileSize: limits.video }
});
