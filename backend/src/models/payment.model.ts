import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  loanId: mongoose.Types.ObjectId;
  utrNumber: string;
  amount: number;
  paymentDate: Date;
  createdBy: mongoose.Types.ObjectId;
}

const paymentSchema = new Schema<IPayment>(
  {
    loanId: { type: Schema.Types.ObjectId, ref: 'Loan', required: true },
    utrNumber: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
