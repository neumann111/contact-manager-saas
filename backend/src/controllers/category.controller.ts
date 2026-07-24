import { Request, Response } from 'express';
import Category from '../models/category.model';
import Contact from '../models/contact.model';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const userId = req.user!._id;

  const category = await Category.create({ 
    name, 
    description, 
    user: userId 
  });
  
  res.status(201).json({ status: 'success', data: { category } });
});

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const categories = await Category.find({ user: userId }).sort('-createdAt');
  
  res.status(200).json({ status: 'success', data: { categories } });
});

export const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!._id;

  const category = await Category.findOne({ _id: id, user: userId });
  if (!category) throw new AppError('Category not found', 404);
  
  res.status(200).json({ status: 'success', data: { category } });
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const userId = req.user!._id;

  const category = await Category.findOneAndUpdate(
    { _id: id, user: userId },
    { name, description },
    { new: true, runValidators: true }
  );

  if (!category) throw new AppError('Category not found', 404);
  
  res.status(200).json({ status: 'success', data: { category } });
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!._id;

  const category = await Category.findOneAndDelete({ _id: id, user: userId });
  if (!category) throw new AppError('Category not found', 404);

  // Cascade update to remove this category from all associated contacts
  await Contact.updateMany(
    { category: id, user: userId },
    { $set: { category: null } }
  );

  res.status(204).json({ status: 'success', data: null });
});