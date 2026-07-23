import { Request, Response } from 'express';
import mongoose from 'mongoose';
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
  
  // Extract query params (validated by Zod)
  const page = parseInt(req.query.page as string, 10);
  const limit = parseInt(req.query.limit as string, 10);
  const skip = (page - 1) * limit;
  const { search, category, isFavorite, sort, order } = req.query;

  // Build Query Object
  const queryObj: any = { user: userId };

  if (category) queryObj.category = category;
  if (isFavorite === 'true') queryObj.isFavorite = true;
  if (isFavorite === 'false') queryObj.isFavorite = false;

  // Search Logic (Regex across multiple fields)
  if (search) {
    const searchRegex = new RegExp(search as string, 'i');
    queryObj.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { email: searchRegex },
      { phoneNumber: searchRegex },
      { company: searchRegex },
    ];
  }

  // Sort Logic
  const sortDirection = order === 'desc' ? -1 : 1;
  const sortObj: any = { [sort as string]: sortDirection };

  // Execute Query and Count in parallel for performance
  const [contacts, total] = await Promise.all([
    Contact.find(queryObj)
      .populate('category', 'name')
      .sort(sortObj)
      .skip(skip)
      .limit(limit),
    Contact.countDocuments(queryObj),
  ]);

  res.status(200).json({
    status: 'success',
    results: contacts.length,
    data: {
      contacts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
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

export const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id;

  // Single Aggregation Pipeline to get all stats efficiently
  const stats = await Contact.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId.toString()) } },
    {
      $facet: {
        totalContacts: [{ $count: 'count' }],
        favoriteContacts: [
          { $match: { isFavorite: true } },
          { $count: 'count' }
        ],
        recentlyAdded: [
          { $sort: { createdAt: -1 } },
          { $limit: 5 },
          { $project: { firstName: 1, lastName: 1, email: 1, avatar: 1, createdAt: 1 } }
        ],
        recentlyUpdated: [
          { $sort: { updatedAt: -1 } },
          { $limit: 5 },
          { $project: { firstName: 1, lastName: 1, email: 1, avatar: 1, updatedAt: 1 } }
        ],
        categorySummary: [
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { 
            $lookup: {
              from: 'categories',
              localField: '_id',
              foreignField: '_id',
              as: 'categoryDetails'
            }
          },
          { $unwind: { path: '$categoryDetails', preserveNullAndEmptyArrays: true } },
          {
            $project: {
              name: { $ifNull: ['$categoryDetails.name', 'Uncategorized'] },
              count: 1,
              _id: 1
            }
          },
          { $sort: { count: -1 } }
        ]
      }
    }
  ]);

  // Format the output
  const formattedStats = {
    totalContacts: stats[0].totalContacts[0]?.count || 0,
    favoriteContacts: stats[0].favoriteContacts[0]?.count || 0,
    recentlyAdded: stats[0].recentlyAdded,
    recentlyUpdated: stats[0].recentlyUpdated,
    categorySummary: stats[0].categorySummary,
  };

  res.status(200).json({ status: 'success', data: { stats: formattedStats } });
});