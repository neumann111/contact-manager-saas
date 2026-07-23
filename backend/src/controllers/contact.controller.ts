import { Request, Response } from 'express';
import Contact from '../models/contact.model';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const createContact = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const contactData = { ...req.body, user: userId };

  const contact = await Contact.create(contactData);

  res.status(201).json({ status: 'success', data: { contact } });
});

export const getContacts = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id;
  
  // Basic fetch - Advanced filtering & pagination to be implemented in Phase 4
  const contacts = await Contact.find({ user: userId })
    .populate('category', 'name')
    .sort({ firstName: 1 });

  res.status(200).json({ status: 'success', results: contacts.length, data: { contacts } });
});

export const getContactById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!._id;

  const contact = await Contact.findOne({ _id: id, user: userId }).populate('category', 'name');
  if (!contact) throw new AppError('Contact not found', 404);

  res.status(200).json({ status: 'success', data: { contact } });
});

export const updateContact = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!._id;

  const contact = await Contact.findOneAndUpdate(
    { _id: id, user: userId },
    req.body,
    { new: true, runValidators: true }
  ).populate('category', 'name');

  if (!contact) throw new AppError('Contact not found', 404);

  res.status(200).json({ status: 'success', data: { contact } });
});

export const deleteContact = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!._id;

  const contact = await Contact.findOneAndDelete({ _id: id, user: userId });
  if (!contact) throw new AppError('Contact not found', 404);

  res.status(204).json({ status: 'success', data: null });
});