import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized, no token provided');
    }

    const decoded = verifyToken(token);
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
    
    next();
  } catch (error) {
    next(new ApiError(401, 'Not authorized, token failed'));
  }
};
