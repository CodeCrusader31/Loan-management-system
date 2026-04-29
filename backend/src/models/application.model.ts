import mongoose, { Schema, Document } from 'mongoose';
import { EmploymentMode } from '../types';

export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  pan: string;
  dob: Date;
  monthlySalary: number;
  employmentMode: EmploymentMode;
  salarySlipUrl?: string;
  eligibilityStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  createdAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    pan: { type: String, required: true, uppercase: true },
    dob: { type: Date, required: true },
    monthlySalary: { type: Number, required: true },
    employmentMode: {
      type: String,
      enum: ['SALARIED', 'SELF_EMPLOYED', 'UNEMPLOYED'],
      required: true,
    },
    salarySlipUrl: { type: String },
    eligibilityStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

export const Application = mongoose.model<IApplication>('Application', applicationSchema);
