import { IApplication } from '../models/application.model';

export const evaluateEligibility = (application: Partial<IApplication>): { isEligible: boolean; rejectionReason?: string } => {
  const { dob, monthlySalary, pan, employmentMode } = application;
  
  // Calculate Age
  const birthDate = new Date(dob!);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 23 || age > 50) {
    return { isEligible: false, rejectionReason: 'Age must be between 23 and 50 years' };
  }

  if (monthlySalary! < 25000) {
    return { isEligible: false, rejectionReason: 'Monthly salary must be at least 25000' };
  }

  if (employmentMode === 'UNEMPLOYED') {
    return { isEligible: false, rejectionReason: 'Unemployed individuals are not eligible' };
  }

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(pan!)) {
    return { isEligible: false, rejectionReason: 'Invalid PAN format' };
  }

  return { isEligible: true };
};
