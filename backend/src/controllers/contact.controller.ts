import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Contact from '../models/contact.model';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { Parser } from 'json2csv';
import fs from 'fs';
import csv from 'csv-parser';

export const createContact = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const contactData = { ...req.body, user: userId };
  const contact = await Contact.create(contactData);
  res.status(201).json({ status: 'success', data: { contact } });
});

export const getContacts = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const page = parseInt(req.query.page as string, 10);
  const limit = parseInt(req.query.limit as string, 10);
  const skip = (page - 1) * limit;
  const { search, category, isFavorite, sort, order } = req.query;

  const queryObj: any = { user: userId };
  if (category) queryObj.category = category;
  if (isFavorite === 'true') queryObj.isFavorite = true;
  if (isFavorite === 'false') queryObj.isFavorite = false;

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

  const sortDirection = order === 'desc' ? -1 : 1;
  const sortObj: any = { [sort as string]: sortDirection };

  const [contacts, total] = await Promise.all([
    Contact.find(queryObj).populate('category', 'name').sort(sortObj).skip(skip).limit(limit),
    Contact.countDocuments(queryObj),
  ]);

  res.status(200).json({
    status: 'success',
    results: contacts.length,
    data: { contacts, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } },
  });
});

export const getContactById = catchAsync(async (req: Request, res: Response) => {
  const contact = await Contact.findOne({ _id: req.params.id, user: req.user!._id }).populate('category', 'name');
  if (!contact) throw new AppError('Contact not found', 404);
  res.status(200).json({ status: 'success', data: { contact } });
});

export const updateContact = catchAsync(async (req: Request, res: Response) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: req.params.id, user: req.user!._id },
    req.body,
    { new: true, runValidators: true }
  ).populate('category', 'name');
  if (!contact) throw new AppError('Contact not found', 404);
  res.status(200).json({ status: 'success', data: { contact } });
});

export const deleteContact = catchAsync(async (req: Request, res: Response) => {
  const contact = await Contact.findOneAndDelete({ _id: req.params.id, user: req.user!._id });
  if (!contact) throw new AppError('Contact not found', 404);
  res.status(204).json({ status: 'success', data: null });
});

export const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id;
  const stats = await Contact.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId.toString()) } },
    {
      $facet: {
        totalContacts: [{ $count: 'count' }],
        favoriteContacts: [{ $match: { isFavorite: true } }, { $count: 'count' }],
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
          { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'categoryDetails' } },
          { $unwind: { path: '$categoryDetails', preserveNullAndEmptyArrays: true } },
          { $project: { name: { $ifNull: ['$categoryDetails.name', 'Uncategorized'] }, count: 1, _id: 1 } },
          { $sort: { count: -1 } }
        ]
      }
    }
  ]);

  const formattedStats = {
    totalContacts: stats[0].totalContacts[0]?.count || 0,
    favoriteContacts: stats[0].favoriteContacts[0]?.count || 0,
    recentlyAdded: stats[0].recentlyAdded,
    recentlyUpdated: stats[0].recentlyUpdated,
    categorySummary: stats[0].categorySummary,
  };

  res.status(200).json({ status: 'success', data: { stats: formattedStats } });
});

// NEW: Export Contacts to CSV
export const exportContacts = catchAsync(async (req: Request, res: Response) => {
  const contacts = await Contact.find({ user: req.user!._id }).populate('category', 'name').lean();
  
  if (contacts.length === 0) {
    throw new AppError('No contacts found to export', 404);
  }

  // Flatten the category object for CSV structure
  const csvData = contacts.map((c: any) => ({
    FirstName: c.firstName,
    LastName: c.lastName,
    Email: c.email || '',
    PhoneNumber: c.phoneNumber || '',
    Company: c.company || '',
    Category: c.category?.name || 'Uncategorized',
    IsFavorite: c.isFavorite ? 'Yes' : 'No',
  }));

  const parser = new Parser();
  const csv = parser.parse(csvData);

  res.header('Content-Type', 'text/csv');
  res.attachment('contacts.csv');
  return res.send(csv);
});

// NEW: Import Contacts from CSV
export const importContacts = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError('Please upload a CSV file', 400);

  const results: any[] = [];
  
  // Create a Promise to wait for the stream to finish reading
  await new Promise((resolve, reject) => {
    fs.createReadStream(req.file!.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('error', reject)
      .on('end', resolve);
  });

  // Delete the temporary file from the disk
  fs.unlinkSync(req.file.path);

  if (results.length === 0) {
    throw new AppError('CSV file is empty', 400);
  }

  const userId = req.user!._id;
  const validContacts = results.map((row) => ({
    user: userId,
    firstName: row.FirstName || 'Unknown',
    lastName: row.LastName || 'Unknown',
    email: row.Email || undefined,
    phoneNumber: row.PhoneNumber || undefined,
    company: row.Company || undefined,
    isFavorite: row.IsFavorite?.toLowerCase() === 'yes',
  }));

  try {
    // ordered: false ensures that if one row fails (e.g., duplicate email), the rest will still insert
    const inserted = await Contact.insertMany(validContacts, { ordered: false });
    res.status(200).json({
      status: 'success',
      message: `Successfully imported ${inserted.length} contacts.`,
    });
  } catch (error: any) {
    // Handle partial success (some inserted, some failed due to unique index)
    if (error.code === 11000) {
      res.status(200).json({
        status: 'success',
        message: 'Imported valid contacts. Skipped contacts with duplicate emails.',
      });
    } else {
      throw new AppError('Error importing contacts', 500);
    }
  }
});