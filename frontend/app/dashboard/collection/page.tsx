'use client';

import { useEffect, useState } from 'react';
import api, { getApiData } from '@/services/api';
import { Loan, User } from '@/types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { X, IndianRupee } from 'lucide-react';

const formatMoney = (value: number) =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function CollectionDashboard() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [utrNumber, setUtrNumber] = useState<string>('');

  const fetchCollectionData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/dashboard/collection');
      setLoans(getApiData<Loan[]>(response));
    } catch (error) {
      console.error('Failed to fetch collection data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectionData();
  }, []);

  const handleActionClick = (loan: Loan) => {
    setSelectedLoan(loan);
    setAmount('');
    setUtrNumber('');
  };

  const submitPayment = async () => {
    if (!selectedLoan) return;
    
    const paymentAmount = Number(amount);
    if (paymentAmount <= 0) {
      toast.error('Payment amount must be greater than 0');
      return;
    }
    
    // if (paymentAmount > selectedLoan.outstandingAmount) {
    //   toast.error(`Amount cannot exceed outstanding balance (₹${formatMoney(selectedLoan.outstandingAmount)})`);
    //   return;
    // }

    const EPSILON = 0.01;

if (paymentAmount - selectedLoan.outstandingAmount > EPSILON) {
  toast.error(`Amount cannot exceed outstanding balance`);
  return;
}

    if (!utrNumber.trim()) {
      toast.error('UTR Number is required');
      return;
    }

    setIsProcessing(true);
    try {
      await api.post(`/payment/${selectedLoan._id}`, {
        amount: paymentAmount,
        utrNumber: utrNumber.trim()
      });
      toast.success('Payment recorded successfully');
      
      // We should close modal and refetch data
      // (The loan's outstanding balance will be updated automatically by the backend)
      setSelectedLoan(null);
      fetchCollectionData();
    } catch (error: any) {
      // Show duplicate UTR error if backend returns it
      toast.error(error.response?.data?.message || 'Failed to record payment');
    } finally {
      setIsProcessing(false);
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
      header: 'Outstanding',
      accessor: (row) => (
        <span className="font-bold text-blue-600">₹{formatMoney(row.outstandingAmount)}</span>
      ),
    },
    {
      header: 'Total Repayment',
      accessor: (row) => `₹${formatMoney(row.totalRepayment)}`,
    },
    {
      header: 'Status',
      accessor: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <Button 
          variant="outline" 
          className="text-xs py-1 h-8 px-3 border-blue-200 text-blue-700 hover:bg-blue-50"
          onClick={() => handleActionClick(row)}
          disabled={row.outstandingAmount <= 0}
        >
          Add Payment
        </Button>
      ),
    },
  ];

  const paymentAmount = Number(amount);
  const isValid = paymentAmount > 0 && 
                 selectedLoan && 
                 paymentAmount <= selectedLoan.outstandingAmount && 
                 utrNumber.trim().length > 3;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Collection Dashboard</h1>
        <p className="text-gray-500 mt-1">Record repayments for disbursed loans.</p>
      </div>

      <DataTable
        data={loans}
        columns={columns}
        isLoading={isLoading}
        keyExtractor={(loan) => loan._id}
        emptyMessage="No disbursed loans available for collection."
      />

      {/* Payment Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Record Payment</h3>
              <button 
                onClick={() => setSelectedLoan(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex justify-between items-center">
                <div>
                  <p className="text-sm text-blue-800 font-medium">Outstanding Balance</p>
                  <p className="text-2xl font-bold text-blue-900 flex items-center mt-1">
                    <IndianRupee className="h-5 w-5 mr-1" />
                    {formatMoney(selectedLoan.outstandingAmount)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Input 
                    label="Payment Amount (₹)" 
                    type="number" 
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    error={paymentAmount > selectedLoan.outstandingAmount ? "Amount exceeds outstanding balance" : undefined}
                  />
                </div>
                <div>
                  <Input 
                    label="UTR / Reference Number" 
                    type="text" 
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. UTR123456789"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedLoan(null)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary"
                  onClick={submitPayment}
                  isLoading={isProcessing}
                  disabled={!isValid}
                >
                  Record Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
