'use client';

import { useEffect, useState } from 'react';
import api, { getApiData } from '@/services/api';
import RoleGuard from '@/components/RoleGuard';
import { Loan } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Loader2, FileText, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function MyLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await api.get('/loan/my-loans');
        setLoans(getApiData<Loan[]>(response));
      } catch (error) {
        console.error('Failed to fetch loans', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLoans();
  }, []);

  return (
    <RoleGuard allowedRoles={['BORROWER']}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">My Loans</h2>
            <Link href="/apply-loan">
              <Button>Apply for New Loan</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : loans.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No loans found</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                You haven't applied for any loans yet. Get started by applying for your first loan today.
              </p>
              <Link href="/apply-loan">
                <Button>Apply Now</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {loans.map((loan) => (
                <div key={loan._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-5 border-b border-gray-100 flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Loan ID: {loan._id.slice(-6).toUpperCase()}</p>
                      <h3 className="text-xl font-bold text-gray-900">₹{loan.principalAmount.toLocaleString()}</h3>
                    </div>
                    <StatusBadge status={loan.status} />
                  </div>
                  
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Tenure</p>
                        <p className="font-medium text-gray-900">{loan.tenureDays} Days</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Interest (12%)</p>
                        <p className="font-medium text-gray-900">₹{Math.round(loan.interestAmount).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Total Repayment</span>
                        <span className="font-medium">₹{Math.round(loan.totalRepayment).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-green-600">Paid Amount</span>
                        <span className="font-medium text-green-700">₹{Math.round(loan.paidAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm bg-gray-50 p-2 rounded-md border border-gray-100">
                        <span className="text-gray-700 font-medium">Outstanding</span>
                        <span className="font-bold text-blue-600 flex items-center">
                          <IndianRupee className="h-3 w-3 mr-0.5" />
                          {Math.round(loan.outstandingAmount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar for repayment */}
                  <div className="h-1.5 w-full bg-gray-100">
                    <div 
                      className="h-1.5 bg-green-500 transition-all" 
                      style={{ width: `${Math.min(100, (loan.paidAmount / loan.totalRepayment) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
