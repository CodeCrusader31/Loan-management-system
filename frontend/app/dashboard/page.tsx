'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { ShieldCheck, Users, FileCheck, Banknote, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  const modules = [
    { name: 'Sales', href: '/dashboard/sales', icon: Users, desc: 'View registered users without loans', roles: ['ADMIN', 'SALES'], color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Sanction', href: '/dashboard/sanction', icon: FileCheck, desc: 'Approve or reject applied loans', roles: ['ADMIN', 'SANCTION'], color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { name: 'Disbursement', href: '/dashboard/disbursement', icon: Banknote, desc: 'Process sanctioned loans', roles: ['ADMIN', 'DISBURSEMENT'], color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Collection', href: '/dashboard/collection', icon: Wallet, desc: 'Record repayments', roles: ['ADMIN', 'COLLECTION'], color: 'text-green-600', bg: 'bg-green-100' },
  ];

  const visibleModules = modules.filter(m => m.roles.includes(user.role));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome, {user.name}</h1>
        <p className="text-gray-500 mt-1">
          You are logged in as <span className="font-medium text-gray-700">{user.role}</span>.
        </p>
      </div>

      {user.role === 'ADMIN' && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white flex items-center">
          <div className="p-3 bg-white/20 rounded-full mr-5">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Admin Privileges Active</h2>
            <p className="text-blue-100 mt-1">You have access to all modules across the platform.</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {visibleModules.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.name} href={module.href}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer h-full">
                <div className={`w-12 h-12 rounded-lg ${module.bg} ${module.color} flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{module.name}</h3>
                <p className="text-sm text-gray-500 mt-2">{module.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
