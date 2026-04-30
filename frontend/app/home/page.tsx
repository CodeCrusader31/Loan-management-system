'use client';

import { useEffect, useState } from 'react';
import api, { getApiData } from '@/services/api';
import RoleGuard from '@/components/RoleGuard';
import { Loan } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { StatsCard } from '@/components/ui/StatsCard';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { 
  FileText, 
  IndianRupee, 
  Wallet, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  LogOut,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BorrowerHomePage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await api.get('/loan/my-loans');
        setLoans(getApiData<Loan[]>(response));
      } catch (error: any) {
        setFetchError(error.response?.data?.message || 'Failed to fetch loans');
        console.error('Failed to fetch loans', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const totalLoans = loans.length;
  const activeLoans = loans.filter(l => ['APPLIED', 'SANCTIONED', 'DISBURSED'].includes(l.status)).length;
  const totalOutstanding = loans.reduce((acc, curr) => acc + curr.outstandingAmount, 0);
  const totalPaid = loans.reduce((acc, curr) => acc + curr.paidAmount, 0);

  return (
    <RoleGuard allowedRoles={['BORROWER']}>
      <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
        {/* Borrower Navbar */}
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">LendOS</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-600 hidden sm:block">
                  {user?.name}
                </span>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Welcome Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome back, {user?.name?.split(' ')[0]}
              </h1>
              <p className="mt-2 text-slate-500">Here is an overview of your loan applications and balances.</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Link href="/apply-loan">
                <Button className="rounded-full shadow-sm bg-blue-600 hover:bg-blue-700">
                  <span className="flex items-center">
                    Apply for New Loan <Zap className="ml-2 h-4 w-4" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatsCard 
              title="Total Loans" 
              value={totalLoans} 
              icon={<FileText className="h-6 w-6 text-blue-600" />} 
            />
            <StatsCard 
              title="Active Loans" 
              value={activeLoans} 
              icon={<Clock className="h-6 w-6 text-amber-500" />} 
            />
            <StatsCard 
              title="Total Outstanding" 
              value={`₹${Math.round(totalOutstanding).toLocaleString()}`} 
              icon={<IndianRupee className="h-6 w-6 text-purple-600" />} 
            />
            <StatsCard 
              title="Total Paid" 
              value={`₹${Math.round(totalPaid).toLocaleString()}`} 
              icon={<Wallet className="h-6 w-6 text-green-600" />} 
            />
          </div>

          {/* Loan List Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Your Loans</h2>
          </div>

          {fetchError ? (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-red-700">
              {fetchError}
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 h-64 animate-pulse flex flex-col justify-between">
                  <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-10 bg-slate-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : loans.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center shadow-sm">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Active Loans</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-8">
                You haven't applied for any loans yet. Get started in minutes with our fully digital process.
              </p>
              <Link href="/apply-loan">
                <Button className="rounded-full px-8 bg-blue-600 hover:bg-blue-700">Apply Now</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loans.map((loan) => (
                <div key={loan._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                  {/* Card Header */}
                  <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">LOAN ID: {loan._id.slice(-6).toUpperCase()}</p>
                      <h3 className="text-2xl font-bold text-slate-900">₹{loan.principalAmount.toLocaleString()}</h3>
                    </div>
                    <StatusBadge status={loan.status} />
                  </div>

                  {/* Reject Reason (If any) */}
                  {loan.status === 'REJECTED' && (
                    <div className="px-6 py-3 bg-red-50 border-b border-red-100 flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">
                        <span className="font-semibold">Rejected:</span> Automatically rejected by BRE policies or sanction team.
                      </p>
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="p-6 flex-1 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Tenure</span>
                      <span className="font-medium text-slate-900">{loan.tenureDays} Days</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Interest (12% p.a)</span>
                      <span className="font-medium text-slate-900">₹{Math.round(loan.interestAmount).toLocaleString()}</span>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-medium text-slate-700">Repayment Progress</span>
                        <span className="text-sm font-bold text-slate-900">
                          {Math.round((loan.paidAmount / loan.totalRepayment) * 100)}%
                        </span>
                      </div>
                      {/* Progress Bar */}
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            loan.status === 'CLOSED' ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(100, (loan.paidAmount / loan.totalRepayment) * 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-xs">
                        <span className="text-slate-500">Paid: ₹{Math.round(loan.paidAmount).toLocaleString()}</span>
                        <span className="font-medium text-blue-600">Left: ₹{Math.round(loan.outstandingAmount).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Footer Actions */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <Button variant="outline" className="flex-1 bg-white border-slate-200">
                      Details
                    </Button>
                    {(loan.status === 'DISBURSED' && loan.outstandingAmount > 0) && (
                      <Button variant="primary" className="flex-1">
                        Pay Now
                      </Button>
                    )}
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
