import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

type JwtExpiresIn = `${number}${'s' | 'm' | 'h' | 'd' | 'w'}`;

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  MONGODB_URI: z.string().min(1, 'MongoDB connection string is required'),
  JWT_SECRET: z.string().min(1, 'JWT Secret is required'),
  JWT_EXPIRES_IN: z.string().default('1h') as z.ZodType<JwtExpiresIn>,
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT Refresh Secret is required'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d') as z.ZodType<JwtExpiresIn>,
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:\n', _env.error.format());
  process.exit(1);
}

export const env = _env.data;