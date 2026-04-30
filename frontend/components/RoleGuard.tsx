'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Role } from '@/types';
import toast from 'react-hot-toast';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user && !allowedRoles.includes(user.role)) {
      toast.error('Unauthorized access');
      
      // Redirect based on role if unauthorized for current page
      if (user.role === 'BORROWER') {
        router.push('/home');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, allowedRoles, router]);

  if (!isMounted) return null;
  if (!isAuthenticated || !user) return null;
  if (!allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
