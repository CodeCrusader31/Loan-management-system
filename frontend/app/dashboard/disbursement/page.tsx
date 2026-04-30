'use client';

import { useEffect, useState } from 'react';
import api, { getApiData } from '@/services/api';
import { Loan, User } from '@/types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

export default function DisbursementDashboard() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchDisbursementData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/dashboard/disbursement');
      setLoans(getApiData<Loan[]>(response));
    } catch (error) {
      console.error('Failed to fetch disbursement data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDisbursementData();
  }, []);

  const handleActionClick = (loanId: string) => {
    setSelectedLoanId(loanId);
  };

  const submitAction = async () => {
    if (!selectedLoanId) return;
    setIsProcessing(true);
    try {
      await api.patch(`/dashboard/loan/${selectedLoanId}/disburse`);
      toast.success('Loan marked as disbursed successfully');
      fetchDisbursementData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Disbursement failed');
    } finally {
      setIsProcessing(false);
      setSelectedLoanId(null);
    }
  };

  const columns: Column<Loan>[] = [
    {
      header: 'Borrower',
      accessor: (row) => {
        const borrower = row.userId as User;
        return <span className="font-medium">{borrower?.name || 'Unknown'}</span>;
      },
    },
    {
      header: 'Amount',
      accessor: (row) => `₹${row.principalAmount.toLocaleString()}`,
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <Button 
          variant="primary" 
          className="text-xs py-1 h-8 px-3"
          onClick={() => handleActionClick(row._id)}
        >
          Mark Disbursed
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Disbursement Dashboard</h1>
        <p className="text-gray-500 mt-1">Process sanctioned loans for disbursement.</p>
      </div>

      <DataTable
        data={loans}
        columns={columns}
        isLoading={isLoading}
        keyExtractor={(loan) => loan._id}
        emptyMessage="No sanctioned loans pending disbursement."
      />

      {/* Confirmation Modal */}
      {selectedLoanId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Disbursement</h3>
              <button 
                onClick={() => setSelectedLoanId(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to mark this loan as disbursed? The funds should have been transferred to the borrower's account.
              </p>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedLoanId(null)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary"
                  onClick={submitAction}
                  isLoading={isProcessing}
                >
                  Confirm Disbursement
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
