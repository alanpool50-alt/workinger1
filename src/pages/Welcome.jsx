import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../components/i18n/LanguageContext';
import LanguageSwitcher from '../components/shared/LanguageSwitcher';
import { Briefcase, Users, ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function Welcome() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/Explore');
      }
    }
  }, [user, navigate]);

  const handleGetStarted = () => setStep(1);
  const handleContinue = () => navigate('/Explore');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Language switcher */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col items-center justify-center px-6 text-center"
          >
            {/* Logo / Brand */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-8"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-xl shadow-indigo-200">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Workinger</h1>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-slate-800 mb-3">
                {t('welcome')}
              </h2>
              <p className="text-slate-500 text-lg mb-12 max-w-sm">
                {t('welcome_sub')}
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-full max-w-xs"
            >
              <Button
                onClick={handleGetStarted}
                className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-semibold gap-2 shadow-lg shadow-indigo-200"
              >
                {t('get_started')}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Decorative dots */}
            <div className="flex gap-2 mt-12">
              <div className="w-2 h-2 rounded-full bg-indigo-600" />
              <div className="w-2 h-2 rounded-full bg-slate-200" />
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="role"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col items-center justify-center px-6"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
              {t('welcome')}
            </h2>

            <div className="w-full max-w-sm space-y-4">
              <button
                onClick={() => setRole('seeker')}
                className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                  role === 'seeker'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  role === 'seeker' ? 'bg-indigo-600' : 'bg-slate-100'
                }`}>
                  <Briefcase className={`w-6 h-6 ${role === 'seeker' ? 'text-white' : 'text-slate-500'}`} />
                </div>
                <div className={`text-${isRTL ? 'right' : 'left'}`}>
                  <p className="font-semibold text-slate-900">{t('looking_for_job')}</p>
                </div>
                <ChevronRight className={`w-5 h-5 text-slate-400 ${isRTL ? 'mr-auto rotate-180' : 'ml-auto'}`} />
              </button>

              <button
                onClick={() => setRole('employer')}
                className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                  role === 'employer'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  role === 'employer' ? 'bg-indigo-600' : 'bg-slate-100'
                }`}>
                  <Users className={`w-6 h-6 ${role === 'employer' ? 'text-white' : 'text-slate-500'}`} />
                </div>
                <div className={`text-${isRTL ? 'right' : 'left'}`}>
                  <p className="font-semibold text-slate-900">{t('i_am_hiring')}</p>
                </div>
                <ChevronRight className={`w-5 h-5 text-slate-400 ${isRTL ? 'mr-auto rotate-180' : 'ml-auto'}`} />
              </button>
            </div>

            <Button
              onClick={handleContinue}
              disabled={!role}
              className="w-full max-w-sm h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-lg font-semibold mt-8 gap-2 shadow-lg shadow-indigo-200 disabled:opacity-40"
            >
              {t('continue')}
              <ArrowRight className="w-5 h-5" />
            </Button>

            <div className="flex gap-2 mt-12">
              <div className="w-2 h-2 rounded-full bg-slate-200" />
              <div className="w-2 h-2 rounded-full bg-indigo-600" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
