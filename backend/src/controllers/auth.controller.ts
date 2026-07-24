import { Request, Response } from 'express';
import User from '../models/user.model';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const register = catchAsync(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email is already in use', 409);
  }

  const user = await User.create({ firstName, lastName, email, password });
  const { accessToken, refreshToken } = generateTokens(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(201).json({
    status: 'success',
    data: { user, accessToken, refreshToken },
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // We must explicitly select password here because we set select: false in the model
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  const { accessToken, refreshToken } = generateTokens(user._id);
  user.password = undefined;

  res.status(200).json({
    status: 'success',
    data: { user, accessToken, refreshToken },
  });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    const tokens = generateTokens(user._id);

    res.status(200).json({
      status: 'success',
      data: tokens,
    });
  } catch (error) {
    throw new AppError('Invalid or expired refresh token', 401);
  }
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user },
  });
});

// ... existing register, login, refresh, getMe functions ...

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { firstName, lastName, email } = req.body;

  // Check if email is being updated to one that already exists
  if (email && email !== req.user!.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email is already in use by another account.', 400);
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user!._id,
    { firstName, lastName, email },
    { new: true, runValidators: true }
  );

  res.status(200).json({ status: 'success', data: { user: updatedUser } });
});

export const updatePassword = catchAsync(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  // 1. Get user with password
  const user = await User.findById(req.user!._id).select('+password');
  if (!user) throw new AppError('User not found', 404);

  // 2. Check if current password is correct
  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError('Your current password is incorrect.', 401);
  }

  // 3. Update password (pre-save hook will hash it)
  user.password = newPassword;
  await user.save();

  // 4. Issue new tokens so they don't get logged out
  const { accessToken, refreshToken } = generateTokens(user._id);

  user.password = undefined;

  res.status(200).json({ status: 'success', data: { user, accessToken, refreshToken } });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw new AppError('There is no user with that email address.', 404);
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

  // SIMULATED EMAIL
  console.log('\n======================================================');
  console.log(`📩 MOCK EMAIL SENT TO: ${user.email}`);
  console.log(`🔗 PASSWORD RESET LINK: http://localhost:3000/reset-password/${resetToken}`);
  console.log('======================================================\n');

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email (Check Server Console)!',
  });
});

// NEW: Reset Password
export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Token is invalid or has expired', 400);
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const { accessToken, refreshToken } = generateTokens(user._id);

  res.status(200).json({ status: 'success', data: { accessToken, refreshToken } });
});

export const uploadUserAvatar = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('Please upload a valid image file', 400);
  }

  // 1. DELETE OLD AVATAR IF IT EXISTS
  if (req.user!.avatar) {
    // Construct the absolute path to the old image
    const oldAvatarPath = path.join(process.cwd(), req.user!.avatar);
    
    // Check if it exists on the disk, and if so, safely delete it
    if (fs.existsSync(oldAvatarPath)) {
      fs.unlinkSync(oldAvatarPath);
    }
  }

  // 2. SAVE NEW AVATAR
  const avatarUrl = `/uploads/avatars/${req.file.filename}`;

  const updatedUser = await User.findByIdAndUpdate(
    req.user!._id,
    { avatar: avatarUrl },
    { new: true }
  );

  res.status(200).json({ status: 'success', data: { user: updatedUser } });
});

