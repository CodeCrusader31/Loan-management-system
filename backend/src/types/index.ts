export type Role = 'ADMIN' | 'SALES' | 'SANCTION' | 'DISBURSEMENT' | 'COLLECTION' | 'BORROWER';
export type LoanStatus = 'APPLIED' | 'REJECTED' | 'SANCTIONED' | 'DISBURSED' | 'CLOSED';
export type EmploymentMode = 'SALARIED' | 'SELF_EMPLOYED' | 'UNEMPLOYED';

// Extending Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}
