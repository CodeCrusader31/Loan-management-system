export const calculateLoanDetails = (principalAmount: number, tenureDays: number, interestRate: number = 12) => {
  // Simple Interest: SI = (P × R × T) / (365 × 100)
  const interestAmount = (principalAmount * interestRate * tenureDays) / (365 * 100);
  const totalRepayment = principalAmount + interestAmount;
  
  return {
    interestAmount: Math.round(interestAmount * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100,
    outstandingAmount: Math.round(totalRepayment * 100) / 100,
  };
};
