import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { Role } from '../types';

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Not authorized'));
    }
    
    if (!roles.includes(req.user.role as Role)) {
      return next(new ApiError(403, `User role ${req.user.role} is not authorized to access this route`));
    }
    
    next();
  };
};
