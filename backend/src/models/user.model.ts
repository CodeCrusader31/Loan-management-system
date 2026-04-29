import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { Role } from '../types';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional because we might not return it
  role: Role;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['ADMIN', 'SALES', 'SANCTION', 'DISBURSEMENT', 'COLLECTION', 'BORROWER'],
      required: true,
      default: 'BORROWER',
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (this: IUser) {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password as string);
};

export const User = mongoose.model<IUser>('User', userSchema);
