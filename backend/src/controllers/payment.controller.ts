import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { Loan } from '../models/loan.model';
import { Payment } from '../models/payment.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

type AddPaymentParams = {
  loanId: string;
};

export const addPayment = async (req: Request<AddPaymentParams>, res: Response, next: NextFunction) => {
  try {
    const { loanId } = req.params;
    const { utrNumber, amount } = req.body;
    const createdBy = req.user?.userId;

    if (!mongoose.isValidObjectId(loanId)) {
      throw new ApiError(400, 'Invalid loan ID');
    }

    if (!createdBy || !mongoose.isValidObjectId(createdBy)) {
      throw new ApiError(401, 'Not authorized');
    }

    const loan = await Loan.findById(loanId);
    if (!loan) throw new ApiError(404, 'Loan not found');

    if (loan.status !== 'DISBURSED') {
      throw new ApiError(400, 'Can only add payments to disbursed loans');
    }

    if (amount > loan.outstandingAmount) {
      throw new ApiError(400, 'Payment amount cannot exceed outstanding amount');
    }

    const existingPayment = await Payment.findOne({ utrNumber });
    if (existingPayment) {
      throw new ApiError(400, 'Payment with this UTR already exists');
    }

    const payment = await Payment.create({
      loanId: new mongoose.Types.ObjectId(loanId),
      utrNumber,
      amount,
      createdBy: new mongoose.Types.ObjectId(createdBy),
    });

    loan.paidAmount += amount;
    loan.outstandingAmount -= amount;

    if (loan.outstandingAmount <= 0) {
      loan.status = 'CLOSED';
    }

    await loan.save();

    res.status(201).json(new ApiResponse(201, payment, 'Payment added successfully'));
  } catch (error) {
    next(error);
  }
};
