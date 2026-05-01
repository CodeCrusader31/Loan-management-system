'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api, { getApiData } from '@/services/api';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import RoleGuard from '@/components/RoleGuard';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Loan, LoanStatus } from '@/types';

// Schemas
const step1Schema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
  dob: z.string().min(1, 'DOB is required'),
  monthlySalary: z.number({ message: 'Salary is required' }).min(1, 'Salary must be greater than 0'),
  employmentMode: z.enum(['SALARIED', 'SELF_EMPLOYED', 'UNEMPLOYED']),
});

type Step1Values = z.infer<typeof step1Schema>;
const activeLoanStatuses: LoanStatus[] = ['APPLIED', 'SANCTIONED', 'DISBURSED'];

export default function ApplyLoanPage() {
  const [step, setStep] = useState(1);
  const [breError, setBreError] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [activeLoan, setActiveLoan] = useState<Loan | null>(null);
  const [isCheckingLoan, setIsCheckingLoan] = useState(true);
  
  // Step 1 Form
  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1, isSubmitting: isSubmittingStep1 },
  } = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: { employmentMode: 'SALARIED' },
  });

  // Step 2 State
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipUrl, setSlipUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  // Step 3 State
  const [amount, setAmount] = useState<number>(100000);
  const [tenure, setTenure] = useState<number>(180);
  const [isApplying, setIsApplying] = useState(false);
  const interestRate = 12; // Example 12% PA
  const si = (amount * interestRate * tenure) / (365 * 100);
  const totalRepayment = amount + si;

  useEffect(() => {
    const checkActiveLoan = async () => {
      try {
        const response = await api.get('/loan/my-loans');
        const loans = getApiData<Loan[]>(response);
        const currentLoan = loans.find((loan) => activeLoanStatuses.includes(loan.status)) || null;
        setActiveLoan(currentLoan);
      } catch (error) {
        console.error('Failed to check active loan', error);
      } finally {
        setIsCheckingLoan(false);
      }
    };

    checkActiveLoan();
  }, []);

  const onStep1Submit = async (data: Step1Values) => {
    setBreError(null);
    try {
      await api.post('/application/personal-details', data);
      toast.success('Details verified successfully');
      setStep(2);
    } catch (error: Error | unknown) {
      const msg = error instanceof Error ? error.message : 'Application rejected by BRE';
      setBreError(msg);
      toast.error(msg);
    }
  };


  const handleFileUpload = async () => {
  if (!slipFile && !slipUrl) {
    toast.error('Please upload or provide a slip URL');
    return;
  }

  setIsUploading(true);

  try {
    // ✅ CASE 1: File upload (Cloudinary)
    if (slipFile) {
      const formData = new FormData();
      formData.append('file', slipFile);

      await api.post('/application/upload-slip', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } 
    // ✅ CASE 2: URL fallback
    else {
      await api.post('/application/upload-slip', {
        salarySlipUrl: slipUrl,
      });
    }

    toast.success('Salary slip uploaded successfully');
    setStep(3);
  } catch (error: Error | unknown) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else if (typeof error === 'object' && error !== null && 'response' in error) {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Failed to upload slip');
    } else {
      toast.error('Failed to upload slip');
    }
  } finally {
    setIsUploading(false);
  }
};

  const handleApplyLoan = async () => {
    setApplyError(null);
    setIsApplying(true);
    try {
      await api.post('/loan/apply', {
        principalAmount: amount,
        tenureDays: tenure,
      });
      toast.success('Loan application submitted successfully!');
      setStep(4);
    } catch (error: Error | unknown) {
      const message = error instanceof Error ? error.message : 'Failed to apply for loan';
      setApplyError(message);
      toast.error(message);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <RoleGuard allowedRoles={['BORROWER']}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {isCheckingLoan ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-600">
              Checking loan eligibility...
            </div>
          ) : activeLoan ? (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                  <div>
                    <h2 className="text-lg font-semibold text-amber-900">Loan application in process</h2>
                    <p className="text-amber-800 mt-1 text-sm">
                      You can apply for a new loan only after your current loan is closed.
                    </p>
                    <p className="text-amber-800 mt-2 text-sm">
                      Current status: <span className="font-semibold">{activeLoan.status}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Link href="/my-loans">
                  <Button>View My Loans</Button>
                </Link>
              </div>
            </div>
          ) : (
          <>
          {/* Progress Indicator */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Apply for Loan</h2>
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
              <div className={`absolute left-0 top-1/2 h-1 bg-blue-600 -z-10 transform -translate-y-1/2 transition-all duration-300`} style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
              
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors duration-300 ${step >= s ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
                  {s}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs mt-2 text-gray-500 font-medium">
              <span>Personal Info</span>
              <span>Documents</span>
              <span>Loan Config</span>
              <span>Complete</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            {step === 1 && (
              <form onSubmit={handleSubmitStep1(onStep1Submit)} className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Personal Details</h3>
                
                {breError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      <div>
                        <h4 className="text-red-800 font-medium">Application Rejected</h4>
                        <p className="text-red-700 mt-1 text-sm">{breError}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input label="Full Name" {...registerStep1('fullName')} error={errorsStep1.fullName?.message} />
                  <Input label="PAN Number" {...registerStep1('pan')} error={errorsStep1.pan?.message} placeholder="ABCDE1234F" />
                  <Input label="Date of Birth" type="date" {...registerStep1('dob')} error={errorsStep1.dob?.message} />
                  <Input label="Monthly Salary (₹)" type="number" {...registerStep1('monthlySalary', { valueAsNumber: true })} error={errorsStep1.monthlySalary?.message} />
                  <Select
                    label="Employment Mode"
                    {...registerStep1('employmentMode')}
                    error={errorsStep1.employmentMode?.message}
                    options={[
                      { label: 'Salaried', value: 'SALARIED' },
                      { label: 'Self Employed', value: 'SELF_EMPLOYED' },
                      { label: 'Unemployed', value: 'UNEMPLOYED' },
                    ]}
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" isLoading={isSubmittingStep1}>Save & Continue</Button>
                </div>
              </form>
            )}

            {/* {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Upload Salary Slip</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors bg-gray-50">
                  <div className="space-y-2">
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500 p-1 px-2 border">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setSlipFile(e.target.files?.[0] || null)} />
                      </label>
                      <p className="pl-1 py-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG up to 5MB</p>
                  </div>
                  {slipFile && (
                    <div className="mt-4 p-2 bg-blue-50 text-blue-700 text-sm rounded-md inline-block">
                      Selected: {slipFile.name}
                    </div>
                  )}
                </div>
                
                <div className="text-center text-sm text-gray-500 my-2">OR provide URL</div>
                <Input value={slipUrl} onChange={(e) => setSlipUrl(e.target.value)} placeholder="https://example.com/slip.pdf" />

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={handleFileUpload} isLoading={isUploading}>Upload & Continue</Button>
                </div>
              </div>
            )} */}

            {step === 2 && (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-900">Upload Salary Slip</h3>

    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors bg-gray-50">
      <div className="space-y-2">
        <div className="flex text-sm text-gray-600 justify-center">
          <label className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 p-1 px-2 border">
            <span>Upload a file</span>
            <input
              type="file"
              className="sr-only"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                if (file.size > 5 * 1024 * 1024) {
                  toast.error('File size must be less than 5MB');
                  return;
                }

                setSlipFile(file);
                setSlipUrl('');
              }}
            />
          </label>
          <p className="pl-1 py-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">PDF, PNG, JPG up to 5MB</p>
      </div>

      {slipFile && (
        <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-md inline-flex items-center gap-2">
          📄 {slipFile.name}
        </div>
      )}
    </div>

    <div className="text-center text-sm text-gray-500 my-2">OR provide URL</div>

    <Input
      value={slipUrl}
      onChange={(e) => {
        setSlipUrl(e.target.value);
        setSlipFile(null);
      }}
      placeholder="https://example.com/slip.pdf"
    />

    <div className="flex justify-between pt-4">
      <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
      <Button
        onClick={handleFileUpload}
        isLoading={isUploading}
        disabled={!slipFile && !slipUrl}
      >
        Upload & Continue
      </Button>
    </div>
  </div>
)}
            {step === 3 && (
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-gray-900">Configure Loan</h3>

                {applyError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                      <p className="text-red-700 text-sm">{applyError}</p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Loan Amount (₹)</label>
                      <span className="font-semibold text-blue-600">₹{amount.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="500000"
                      step="10000"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>₹50,000</span>
                      <span>₹5,00,000</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Tenure (Days)</label>
                      <span className="font-semibold text-blue-600">{tenure} Days</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="365"
                      step="5"
                      value={tenure}
                      onChange={(e) => setTenure(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>30 Days</span>
                      <span>365 Days</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h4 className="font-medium text-blue-900 mb-4">Repayment Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700">Principal Amount</span>
                        <span className="font-medium text-blue-900">₹{amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700">Interest (12% p.a.)</span>
                        <span className="font-medium text-blue-900">₹{Math.round(si).toLocaleString()}</span>
                      </div>
                      <div className="pt-3 mt-3 border-t border-blue-200 flex justify-between">
                        <span className="font-semibold text-blue-900">Total Repayment</span>
                        <span className="font-bold text-blue-900 text-lg">₹{Math.round(totalRepayment).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button onClick={handleApplyLoan} isLoading={isApplying}>Submit Application</Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="py-12 text-center space-y-6">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Application Submitted!</h3>
                  <p className="mt-2 text-gray-500 max-w-md mx-auto">
                    Your loan application has been successfully submitted to the sanction team for review. You can track the status in your loans dashboard.
                  </p>
                </div>
                <div className="pt-6">
                  <Link href="/my-loans">
                    <Button>View My Loans</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
          </>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}