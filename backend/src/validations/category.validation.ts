import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().max(500).optional(), // <-- ADD THIS
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    description: z.string().max(500).optional(), // <-- ADD THIS
  }),
});