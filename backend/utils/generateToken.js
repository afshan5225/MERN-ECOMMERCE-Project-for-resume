import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // ✅ true only on Render
    sameSite: 'none', // ✅ allow cookie across domains
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};
