import mongoose, { Schema, Document } from 'mongoose';
import { LoanStatus } from '../types';

export interface ILoan extends Document {
  userId: mongoose.Types.ObjectId;
  applicationId: mongoose.Types.ObjectId;
  principalAmount: number;
  tenureDays: number;
  interestRate: number; // Fixed 12%
  interestAmount: number;
  totalRepayment: number;
  paidAmount: number;
  outstandingAmount: number;
  status: LoanStatus;
}

const loanSchema = new Schema<ILoan>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
    principalAmount: { type: Number, required: true },
    tenureDays: { type: Number, required: true },
    interestRate: { type: Number, default: 12 },
    interestAmount: { type: Number, required: true },
    totalRepayment: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    outstandingAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['APPLIED', 'REJECTED', 'SANCTIONED', 'DISBURSED', 'CLOSED'],
      default: 'APPLIED',
    },
  },
  { timestamps: true }
);

export const Loan = mongoose.model<ILoan>('Loan', loanSchema);
