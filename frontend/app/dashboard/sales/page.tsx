'use client';

import { useEffect, useState } from 'react';
import api, { getApiData } from '@/services/api';
import { User } from '@/types';
import { DataTable, Column } from '@/components/ui/DataTable';

export default function SalesDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await api.get('/dashboard/sales');
        setUsers(getApiData<User[]>(response));
      } catch (error) {
        console.error('Failed to fetch sales data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSalesData();
  }, []);

  const columns: Column<User>[] = [
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Registered Date',
      accessor: (user) => new Date(user.createdAt).toLocaleDateString(),
    },
    {
      header: 'Status',
      accessor: () => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          No Application
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Sales Dashboard</h1>
        <p className="text-gray-500 mt-1">Users registered without an active loan application.</p>
      </div>

      <DataTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        keyExtractor={(user) => user._id}
        emptyMessage="All registered users have applied for a loan."
      />
    </div>
  );
}
