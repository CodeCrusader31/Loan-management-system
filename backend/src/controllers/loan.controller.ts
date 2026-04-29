import { Request, Response, NextFunction } from 'express';
import { Loan } from '../models/loan.model';
import { Application } from '../models/application.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { calculateLoanDetails } from '../services/loan.service';

export const applyForLoan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const { principalAmount, tenureDays } = req.body;

    const application = await Application.findOne({ userId });
    if (!application || application.eligibilityStatus !== 'APPROVED') {
      throw new ApiError(400, 'Cannot apply for loan. Application not approved or missing.');
    }

    const existingLoan = await Loan.findOne({ userId, status: { $ne: 'CLOSED' } });
    if (existingLoan) {
      throw new ApiError(400, 'You already have an active loan application');
    }

    const { interestAmount, totalRepayment, outstandingAmount } = calculateLoanDetails(principalAmount, tenureDays);

    const loan = await Loan.create({
      userId,
      applicationId: application._id,
      principalAmount,
      tenureDays,
      interestAmount,
      totalRepayment,
      outstandingAmount,
      status: 'APPLIED',
    });

    res.status(201).json(new ApiResponse(201, loan, 'Loan application submitted successfully'));
  } catch (error) {
    next(error);
  }
};

export const getMyLoans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const loans = await Loan.find({ userId }).populate('applicationId');
    
    res.status(200).json(new ApiResponse(200, loans, 'Loans fetched successfully'));
  } catch (error) {
    next(error);
  }
};
