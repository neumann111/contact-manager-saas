import { z } from 'zod';

export const createContactSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phoneNumber: z.string().optional(),
    company: z.string().optional(),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID').optional(),
    isFavorite: z.boolean().optional(),
  }),
});

export const updateContactSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    email: z.string().email().optional().or(z.literal('')),
    phoneNumber: z.string().optional(),
    company: z.string().optional(),
    category: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID').optional().nullable(),
    isFavorite: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid contact ID format'),
  }),
});