import { Request, Response, NextFunction } from 'express';
import { Application } from '../models/application.model';
import { Loan } from '../models/loan.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { evaluateEligibility } from '../services/bre.service';
import { LoanStatus } from '../types';

const activeLoanStatuses: LoanStatus[] = ['APPLIED', 'SANCTIONED', 'DISBURSED'];

export const submitPersonalDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;

    const activeLoan = await Loan.findOne({ userId, status: { $in: activeLoanStatuses } });
    if (activeLoan) {
      throw new ApiError(400, 'You already have an active loan application. Apply again after it is closed.');
    }

    const applicationData = { ...req.body, userId };
    
    // Evaluate Eligibility
    const eligibility = evaluateEligibility(applicationData);
    
    applicationData.eligibilityStatus = eligibility.isEligible ? 'APPROVED' : 'REJECTED';
    applicationData.rejectionReason = eligibility.rejectionReason;

    const application = await Application.create(applicationData);

    res.status(201).json(new ApiResponse(201, application, 'Application submitted successfully'));
  } catch (error) {
    next(error);
  }
};

export const uploadSalarySlip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { salarySlipUrl } = req.body;
    const userId = req.user?.userId;

    const application = await Application.findOneAndUpdate(
      { userId },
      { salarySlipUrl },
      { new: true, sort: { createdAt: -1 } }
    );

    if (!application) {
      throw new ApiError(404, 'Application not found. Submit personal details first.');
    }

    res.status(200).json(new ApiResponse(200, application, 'Salary slip uploaded successfully'));
  } catch (error) {
    next(error);
  }
};
