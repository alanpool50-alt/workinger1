import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Flag, Settings, LogOut } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AdminNav() {
  const location = useLocation();

  const navItems = [
    { path: '/Admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/AdminReports', icon: Flag, label: 'Reports' },
    { path: '/Settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = async () => {
    try {
      await base44.auth.logout();
      window.location.href = '/Welcome';
    } catch {
      window.location.href = '/Welcome';
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
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
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center flex-1 h-full text-slate-400 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
}
