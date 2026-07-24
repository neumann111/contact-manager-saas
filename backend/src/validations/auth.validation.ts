import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,50}$/;
const passwordMessage = 'Password must be 8-50 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character (!,@,#,etc).';

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().regex(passwordRegex, passwordMessage),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'), 
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

// NEW: Schema for the Reset Password flow
export const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string().regex(passwordRegex, passwordMessage),
  }),
});

// NEW: Schema for the Profile Settings Update Password flow
export const updatePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().regex(passwordRegex, passwordMessage),
  }),
});