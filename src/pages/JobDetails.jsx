import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '../components/i18n/LanguageContext';
import { useLocation } from '../components/i18n/LocationContext';
import {
  MapPin, Clock, Briefcase, DollarSign, ArrowLeft,
  Bookmark, BookmarkCheck, Share2, MessageCircle, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function JobDetails() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userLocation, getDistance } = useLocation();

  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('id');

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => base44.entities.Job.filter({ id: jobId }),
    select: (data) => data?.[0],
    enabled: !!jobId,
  });

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const { data: savedJobs = [] } = useQuery({
    queryKey: ['savedJobs', user?.email],
    queryFn: () => base44.entities.SavedJob.filter({ user_email: user?.email }),
    enabled: !!user?.email,
  });

  const isSaved = savedJobs.some(s => s.job_id === String(jobId));

  const toggleSave = useMutation({
    mutationFn: async () => {
      const existing = savedJobs.find(s => s.job_id === String(jobId));
      if (existing) {
        await base44.entities.SavedJob.delete(existing.id);
      } else {
        await base44.entities.SavedJob.create({
          job_id: String(jobId),
          user_email: user.email,
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedJobs'] }),
  });

  if (isLoading || !job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  const distance = userLocation?.latitude
    ? getDistance(userLocation.latitude, userLocation.longitude, job.latitude, job.longitude)
    : null;

  const typeLabels = {
    full_time: t('full_time'),
    part_time: t('part_time'),
    contract: t('contract'),
    freelance: t('freelance'),
    internship: t('internship'),
  };

  const expLabels = {
    entry: t('entry_level'),
    mid: t('mid_level'),
    senior: t('senior_level'),
    executive: t('executive'),
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
        <h1 className="font-semibold text-slate-900 truncate flex-1">{t('job_title')}</h1>
        <button onClick={() => toggleSave.mutate()} className="p-2 rounded-full hover:bg-slate-100">
          {isSaved ? (
            <BookmarkCheck className="w-5 h-5 text-indigo-600 fill-indigo-600" />
          ) : (
            <Bookmark className="w-5 h-5 text-slate-400" />
          )}
        </button>
      </div>

      <div className="px-4 pt-5">
        {/* Company info */}
        <div className="flex items-center gap-3 mb-4">
          {job.company_logo_url ? (
            <img src={job.company_logo_url} className="w-14 h-14 rounded-2xl object-cover bg-slate-100" alt="" />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-indigo-500" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
            <p className="text-slate-500">{job.company}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center gap-1 text-sm bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">
            <MapPin className="w-3.5 h-3.5" />
            {job.is_remote ? t('remote') : job.location_name}
          </span>
          {job.job_type && (
            <span className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full">
              {typeLabels[job.job_type]}
            </span>
          )}
          {job.experience_level && (
            <span className="text-sm bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full">
              {expLabels[job.experience_level]}
            </span>
          )}
          {distance && distance < 10000 && (
            <span className="text-sm bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full">
              {Math.round(distance)} {t('km_away')}
            </span>
          )}
        </div>

        {/* Salary */}
        {(job.salary_min || job.salary_max) && (
          <div className="bg-gradient-to-r from-indigo-50 to-slate-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-indigo-500" />
              <span className="text-sm font-medium text-slate-500">{t('salary')}</span>
            </div>
            <p className="text-xl font-bold text-slate-900">
              {job.salary_currency || 'USD'}{' '}
              {job.salary_min?.toLocaleString()}
              {job.salary_max ? ` - ${job.salary_max.toLocaleString()}` : '+'}
            </p>
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <h3 className="font-semibold text-slate-900 mb-2">{t('job_description')}</h3>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{job.description}</p>
        </div>

        {/* Requirements */}
        {job.requirements && (
          <div className="mb-8">
            <h3 className="font-semibold text-slate-900 mb-2">{t('requirements')}</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{job.requirements}</p>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-20 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-100 p-4">
        <div className="flex gap-3 max-w-2xl mx-auto">
          <Button
            variant="outline"
            className="rounded-xl h-12"
            onClick={() => navigate(`/Chat?jobId=${job.id}&employer=${job.posted_by}`)}
          >
            <MessageCircle className="w-5 h-5" />
          </Button>
          <Button
            className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-base font-semibold"
            onClick={() => navigate(`/Apply?id=${job.id}`)}
          >
            {t('apply')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
