import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error instanceof Error ? 400 : 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const response = {
    code: error.statusCode,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  res.status(error.statusCode).json(response);
};
