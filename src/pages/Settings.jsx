import React from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLanguage } from '../components/i18n/LanguageContext';
import LanguageSwitcher from '../components/shared/LanguageSwitcher';
import { ArrowLeft, Globe, Bell, Shield, LogOut, ChevronRight, User } from 'lucide-react';

export default function Settings() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await base44.auth.logout();
      window.location.href = '/Welcome';
    } catch (error) {
      window.location.href = '/Welcome';
    }
  };

  const items = [
    { key: 'account', icon: User, onClick: () => navigate('/Account') },
    { key: 'language', icon: Globe, custom: true },
    { key: 'notifications', icon: Bell, onClick: () => navigate('/NotificationSettings') },
    { key: 'privacy', icon: Shield, onClick: () => navigate('/Privacy') },
  ];

  return (
    <div className="px-4 pt-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">{t('settings')}</h1>
      </div>

      <div className="space-y-2">
        {items.map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-sm transition-all cursor-pointer"
              onClick={item.onClick}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                <Icon className="w-5 h-5 text-slate-600" />
              </div>
              <span className="flex-1 font-medium text-slate-800">{t(item.key)}</span>
              {item.custom ? (
                <LanguageSwitcher variant="full" />
              ) : (
                <ChevronRight className={`w-4 h-4 text-slate-300 ${isRTL ? 'rotate-180' : ''}`} />
              )}
            </div>
          );
        })}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-red-100 hover:bg-red-50 transition-all mt-6"
        >
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-red-500" />
          </div>
          <span className="font-medium text-red-600">{t('logout')}</span>
        </button>
      </div>
    </div>
  );
}
