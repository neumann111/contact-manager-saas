import rateLimit from 'express-rate-limit';

// 1. General API Limiter: Prevents spam/DoS on standard routes
// Allows a maximum of 150 requests per 15 minutes per IP address
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

// 2. Strict Auth Limiter: Heavily restricts login/register/password-reset attempts
// Allows a maximum of 5 attempts per 15 minutes to block brute-force attacks
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
  },
});