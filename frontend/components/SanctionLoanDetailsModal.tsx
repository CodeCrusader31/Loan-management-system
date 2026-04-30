'use client';
import { AlertCircle, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Application, Loan, User } from '@/types';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface SanctionLoanDetailsModalProps {
  loan: Loan;
  onClose: () => void;
  onDecision: (loanId: string, type: 'SANCTIONED' | 'REJECTED') => void;
}

const isUser = (value: Loan['userId']): value is User => {
  return typeof value === 'object' && value !== null && 'email' in value;
};

const isApplication = (value: Loan['applicationId']): value is Application => {
  return typeof value === 'object' && value !== null && 'monthlySalary' in value;
};

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') return 'Not available';
  return `Rs. ${value.toLocaleString('en-IN')}`;
};

const formatDate = (value?: string) => {
  if (!value) return 'Not available';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatEmploymentMode = (value?: Application['employmentMode']) => {
  if (!value) return 'Not available';
  return value.replace('_', ' ');
};

const InfoCard = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="rounded-lg border border-gray-200 bg-white p-4">
    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
      {title}
    </h3>
    {children}
  </section>
);

const DetailRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <div>
    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
      {label}
    </dt>
    <dd className="mt-1 text-sm font-medium text-gray-900">{value}</dd>
  </div>
);

// ✅ Simplified Document Link (no preview)
const DocumentLink = ({ url, label }: { url?: string; label: string }) => {
  if (!url) return <span>Not uploaded</span>;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="text-blue-600 underline-offset-2 hover:text-blue-700 hover:underline"
    >
      {label}
    </a>
  );
};

export function SanctionLoanDetailsModal({
  loan,
  onClose,
  onDecision,
}: SanctionLoanDetailsModalProps) {
  const borrower = isUser(loan.userId) ? loan.userId : null;
  const application = isApplication(loan.applicationId)
    ? loan.applicationId
    : null;

  // ✅ Always allow approval now
  const canApprove = true;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-gray-50 shadow-xl">
        <div className="flex items-start justify-between border-b border-gray-200 bg-white p-5">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">
                Loan Application Details
              </h2>
              <StatusBadge status={loan.status} />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Review borrower and application details before taking a decision.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close loan details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-88px)] space-y-4 overflow-y-auto p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <InfoCard title="Borrower Info">
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailRow
                  label="Name"
                  value={borrower?.name || application?.fullName || 'Unknown'}
                />
                <DetailRow
                  label="Email"
                  value={borrower?.email || 'Not available'}
                />
              </dl>
            </InfoCard>

            <InfoCard title="Loan Summary">
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailRow
                  label="Loan Amount"
                  value={formatCurrency(loan.principalAmount)}
                />
                <DetailRow
                  label="Tenure"
                  value={`${loan.tenureDays} Days`}
                />
              </dl>
            </InfoCard>
          </div>

          <InfoCard title="Application Info">
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DetailRow
                label="Monthly Salary"
                value={formatCurrency(application?.monthlySalary)}
              />
              <DetailRow
                label="Employment Mode"
                value={formatEmploymentMode(application?.employmentMode)}
              />
              <DetailRow
                label="DOB"
                value={formatDate(application?.dob)}
              />
              <DetailRow
                label="Salary Slip"
                value={
                  <DocumentLink
                    url={application?.salarySlipUrl}
                    label="View salary slip"
                  />
                }
              />
              
            </dl>
          </InfoCard>

          <InfoCard title="Decision">
            <div className="flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="danger"
                onClick={() => onDecision(loan._id, 'REJECTED')}
              >
                Reject Loan
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => onDecision(loan._id, 'SANCTIONED')}
                disabled={!canApprove}
              >
                Approve Loan
              </Button>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}