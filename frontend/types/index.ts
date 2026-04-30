export type Role = 'ADMIN' | 'SALES' | 'SANCTION' | 'DISBURSEMENT' | 'COLLECTION' | 'BORROWER';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export type LoanStatus = 'APPLIED' | 'SANCTIONED' | 'DISBURSED' | 'REJECTED' | 'CLOSED';

export interface Loan {
  _id: string;
  userId: string | User;
  applicationId: string | Application;
  principalAmount: number;
  tenureDays: number;
  interestRate: number;
  interestAmount: number;
  totalRepayment: number;
  paidAmount: number;
  outstandingAmount: number;
  status: LoanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  _id: string;
  userId: string | User;
  fullName: string;
  pan: string;
  dob: string;
  monthlySalary: number;
  employmentMode: 'SALARIED' | 'SELF_EMPLOYED' | 'UNEMPLOYED';
  salarySlipUrl?: string;
  eligibilityStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  loanId: string | Loan;
  createdBy: string | User;
  amount: number;
  utrNumber: string;
  paymentDate: string;
  createdAt: string;
}
