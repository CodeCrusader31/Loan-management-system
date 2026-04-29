import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { generateToken } from '../utils/jwt';
import { Role } from '../types';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new ApiError(400, 'User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'BORROWER',
    });

    res.status(201).json(
      new ApiResponse(201, {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }, 'User registered successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = generateToken({ userId: user._id.toString(), role: user.role });

    res.status(200).json(
      new ApiResponse(200, {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      }, 'Login successful')
    );
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    res.status(200).json(new ApiResponse(200, user, 'User details fetched successfully'));
  } catch (error) {
    next(error);
  }
};
