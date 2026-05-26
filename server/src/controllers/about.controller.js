import AppInfo from '../models/AppInfo.js';
import AuditLog from '../models/AuditLog.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAppInfo = asyncHandler(async (req, res) => {
  let info = await AppInfo.findOne();
  
  // Create default if not exists
  if (!info) {
    info = await AppInfo.create({});
  }

  res.status(200).json(new ApiResponse(200, info, 'App info fetched'));
});

export const updateAppInfo = asyncHandler(async (req, res) => {
  let info = await AppInfo.findOne();
  
  if (!info) {
    info = new AppInfo({});
  }

  Object.keys(req.body).forEach(key => {
    info[key] = req.body[key];
  });
  info.updatedBy = req.user._id;

  await info.save();

  await AuditLog.create({
    admin: req.user._id,
    action: 'UPDATE',
    targetType: 'APP_INFO',
    targetId: info._id,
    ipAddress: req.ip
  });

  res.status(200).json(new ApiResponse(200, info, 'App info updated successfully'));
});
