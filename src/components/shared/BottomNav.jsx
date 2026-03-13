import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Search, Bookmark, PlusSquare, MessageCircle, User, Briefcase, FileText } from 'lucide-react';

export default function BottomNav() {
  const { t } = useLanguage();
  const location = useLocation();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
    staleTime: Infinity,
  });

  const isEmployer = user?.role === 'employer';

  const navItems = isEmployer ? [
    { path: '/Explore', icon: Search, label: t('explore_jobs') },
    { path: '/ManageJobs', icon: Briefcase, label: 'My Jobs' },
    { path: '/Applicants', icon: FileText, label: 'Applicants' },
    { path: '/Messages', icon: MessageCircle, label: t('messages') },
    { path: '/Profile', icon: User, label: t('profile') },
  ] : [
    { path: '/Explore', icon: Search, label: t('explore_jobs') },
    { path: '/Saved', icon: Bookmark, label: t('saved') },
    { path: '/PostJob', icon: PlusSquare, label: t('post_job') },
    { path: '/Messages', icon: MessageCircle, label: t('messages') },
    { path: '/Profile', icon: User, label: t('profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-2xl mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
