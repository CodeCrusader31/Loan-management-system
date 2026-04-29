import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError';

export const validate = (schema: ZodSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.issues.map((issue: any) => `${issue.path.join('.')}: ${issue.message}`);
        return next(new ApiError(400, `Validation failed: ${errorMessages.join(', ')}`));
      } else {
        return next(new ApiError(500, 'Internal Server Error'));
      }
    }
  };
};
