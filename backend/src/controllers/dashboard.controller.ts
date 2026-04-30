import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { Loan } from '../models/loan.model';
import { Application } from '../models/application.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

export const getSalesDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Users registered but no application
    const usersWithApps = await Application.find().distinct('userId');
    const usersWithoutApps = await User.find({ _id: { $nin: usersWithApps }, role: 'BORROWER' });
    
    res.status(200).json(new ApiResponse(200, usersWithoutApps, 'Sales dashboard data fetched'));
  } catch (error) {
    next(error);
  }
};

export const getSanctionDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const appliedLoans = await Loan.find({ status: 'APPLIED' })
      .populate('userId')
      .populate('applicationId');
    res.status(200).json(new ApiResponse(200, appliedLoans, 'Sanction dashboard data fetched'));
  } catch (error) {
    next(error);
  }
};

export const updateLoanSanction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'SANCTIONED' or 'REJECTED'

    if (!['SANCTIONED', 'REJECTED'].includes(status)) {
      throw new ApiError(400, 'Invalid status');
    }

    const loan = await Loan.findByIdAndUpdate(id, { status }, { new: true });
    if (!loan) throw new ApiError(404, 'Loan not found');

    res.status(200).json(new ApiResponse(200, loan, `Loan ${status.toLowerCase()} successfully`));
  } catch (error) {
    next(error);
  }
};

export const getDisbursementDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sanctionedLoans = await Loan.find({ status: 'SANCTIONED' }).populate('applicationId userId');
    res.status(200).json(new ApiResponse(200, sanctionedLoans, 'Disbursement dashboard data fetched'));
  } catch (error) {
    next(error);
  }
};

export const updateLoanDisburse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findByIdAndUpdate(id, { status: 'DISBURSED' }, { new: true });
    if (!loan) throw new ApiError(404, 'Loan not found');

    res.status(200).json(new ApiResponse(200, loan, 'Loan disbursed successfully'));
  } catch (error) {
    next(error);
  }
};

export const getCollectionDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const disbursedLoans = await Loan.find({ status: { $in: ['DISBURSED', 'CLOSED'] } }).populate('applicationId userId');
    res.status(200).json(new ApiResponse(200, disbursedLoans, 'Collection dashboard data fetched'));
  } catch (error) {
    next(error);
  }
};
