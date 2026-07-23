import { Request, Response } from 'express';
import User from '../models/user.model';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';

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