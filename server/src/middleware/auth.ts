import { config } from '../constants/index.js';
import jwt from 'jsonwebtoken';
import type { NextFunction, Response } from 'express';
import type { CustomRequest, User } from '../types/index.js';

export const isAuthenticated = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = req?.cookies?.[config.COOKIE_NAME];
    if (!token) {
       res.status(401).json({ message: 'Unauthorized' });
       return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as User;
    req.user = {
      userId: decoded?.userId,
      email: decoded?.email,
      isVerified: decoded?.isVerified,
    };

    next();
  } catch (err) {
    console.error('Authentication error:', err);
     res.status(401).json({ message: 'Unauthorized' });
  }
};
