import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import BottomNav from './components/shared/BottomNav';
import AdminNav from './components/admin/AdminNav';

export default function Layout({ children, currentPageName }) {
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
    retry: false,
    staleTime: Infinity,
  });

  const isAdmin = user?.role === 'admin';
  const isAuthPage = ['Welcome', 'Login', 'SignUp'].includes(currentPageName);

  return (
    <div className="min-h-screen bg-slate-50">
      {children}
      {!isAuthPage && (isAdmin ? <AdminNav /> : <BottomNav />)}
    </div>
  );
}
