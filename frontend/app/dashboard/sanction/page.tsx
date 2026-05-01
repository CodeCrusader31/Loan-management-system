'use client';

import { useEffect, useState } from 'react';
import api, { getApiData } from '@/services/api';
import { Loan, User } from '@/types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { SanctionLoanDetailsModal } from '@/components/SanctionLoanDetailsModal';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

export default function SanctionDashboard() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Modal states
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'SANCTIONED' | 'REJECTED' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchSanctionData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/dashboard/sanction');
      setLoans(getApiData<Loan[]>(response));
    } catch (error) {
      console.error('Failed to fetch sanction data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/dashboard/sanction');
        setLoans(getApiData<Loan[]>(response));
      } catch (error) {
        console.error('Failed to fetch sanction data', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleActionClick = (loanId: string, type: 'SANCTIONED' | 'REJECTED') => {
    setSelectedLoanId(loanId);
    setActionType(type);
  };

  const submitAction = async () => {
    if (!selectedLoanId || !actionType) return;
    setIsProcessing(true);
    try {
      await api.patch(`/dashboard/loan/${selectedLoanId}/sanction`, {
        status: actionType,
      });
      toast.success(`Loan ${actionType.toLowerCase()} successfully`);
      void fetchSanctionData();
      setSelectedLoan(null);
    } catch (error: Error | unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Action failed';
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
      setSelectedLoanId(null);
      setActionType(null);
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
      header: 'Tenure',
      accessor: (row) => `${row.tenureDays} Days`,
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex space-x-2">
          <Button
            variant="primary"
            className="text-xs py-1 h-8"
            onClick={() => handleActionClick(row._id, 'SANCTIONED')}
          >
            Approve
          </Button>

          <Button
            variant="danger"
            className="text-xs py-1 h-8 bg-red-100 text-red-700 hover:bg-red-200 border-none"
            onClick={() => handleActionClick(row._id, 'REJECTED')}
          >
            Reject
          </Button>

          {/* ✅ View Details Button */}
          <Button
            variant="outline"
            className="text-xs py-1 h-8"
            onClick={() => setSelectedLoan(row)}
          >
            View Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Sanction Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Review and approve or reject applied loans.
        </p>
      </div>

      <DataTable
        data={loans}
        columns={columns}
        isLoading={isLoading}
        keyExtractor={(loan) => loan._id}
        emptyMessage="No applied loans pending sanction."
      />

      {/* ✅ Loan Details Modal */}
      {selectedLoan && (
        <SanctionLoanDetailsModal
          loan={selectedLoan}
          onClose={() => setSelectedLoan(null)}
          onDecision={handleActionClick}
        />
      )}

      {/* ✅ Confirmation Modal */}
      {selectedLoanId && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm {actionType === 'SANCTIONED' ? 'Approval' : 'Rejection'}
              </h3>
              <button
                onClick={() => setSelectedLoanId(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to{' '}
                {actionType === 'SANCTIONED' ? 'approve' : 'reject'} this loan?
                This action cannot be undone.
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
                  variant={actionType === 'SANCTIONED' ? 'primary' : 'danger'}
                  onClick={submitAction}
                  isLoading={isProcessing}
                >
                  Confirm{' '}
                  {actionType === 'SANCTIONED' ? 'Approval' : 'Rejection'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}