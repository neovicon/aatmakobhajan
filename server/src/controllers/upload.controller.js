import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import AuditLog from '../models/AuditLog.js';

// Helper function to upload buffer to cloudinary via stream
const streamUpload = (req, folder, resource_type = 'auto') => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder: `abhisekkobhajan/${folder}`, resource_type },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
};

export const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file provided');
  }

  let folder = 'images';
  let resource_type = 'image';

  if (req.originalUrl.includes('audio')) {
    folder = 'audio';
    resource_type = 'video'; // Cloudinary treats audio as video resource type
  } else if (req.originalUrl.includes('video')) {
    folder = 'video';
    resource_type = 'video';
  }

  try {
    const result = await streamUpload(req, folder, resource_type);
    
    // Log the upload action
    await AuditLog.create({
      admin: req.user._id,
      action: 'UPLOAD',
      targetType: 'MEDIA',
      ipAddress: req.ip,
      details: { url: result.secure_url, format: result.format, size: result.bytes }
    });

    res.status(200).json(new ApiResponse(200, {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      size: result.bytes
    }, 'File uploaded successfully'));

  } catch (error) {
    throw new ApiError(500, 'Error uploading file to Cloudinary: ' + error.message);
  }
});
