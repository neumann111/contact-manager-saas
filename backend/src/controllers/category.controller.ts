import { Request, Response } from 'express';
import Category from '../models/category.model';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import Contact from '../models/contact.model';

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  const userId = req.user!._id;

  const category = await Category.create({ name, user: userId });

  res.status(201).json({ status: 'success', data: { category } });
});

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const categories = await Category.find({ user: userId }).sort({ name: 1 });

  res.status(200).json({ status: 'success', results: categories.length, data: { categories } });
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  const { id } = req.params;
  const userId = req.user!._id;

  const category = await Category.findOneAndUpdate(
    { _id: id, user: userId },
    { name },
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

  // NEW: Cascade update to remove this category from all contacts
  await Contact.updateMany(
    { category: id, user: userId },
    { $set: { category: null } }
  );

  res.status(204).json({ status: 'success', data: null });
});