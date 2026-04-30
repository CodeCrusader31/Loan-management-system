import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'SALES', 'SANCTION', 'DISBURSEMENT', 'COLLECTION', 'BORROWER']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const applicationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN card format'),
  dob: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && date.toISOString().startsWith(val.split('T')[0]);
  }, { message: 'Invalid Date of Birth format (use YYYY-MM-DD)' }),
  monthlySalary: z.number().positive('Monthly salary must be positive'),
  employmentMode: z.enum(['SALARIED', 'SELF_EMPLOYED', 'UNEMPLOYED']),
  salarySlipUrl: z.string().url().optional(),
});

export const loanApplySchema = z.object({
  principalAmount: z.number().positive('Amount must be positive'),
  tenureDays: z.number().int().min(30, 'Minimum tenure is 30 days').max(365, 'Maximum tenure is 365 days'),
});

export const paymentSchema = z.object({
  utrNumber: z.string().min(5, 'UTR number is required'),
  amount: z.number().positive('Amount must be positive'),
});