import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '../components/i18n/LanguageContext';
import { useLocation } from '../components/i18n/LocationContext';
import JobCard from '../components/jobs/JobCard';
import { Bookmark, FileCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Saved() {
  const { t } = useLanguage();
  const { userLocation, getDistance } = useLocation();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('saved');

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const { data: savedJobs = [], isLoading: loadingSaved } = useQuery({
    queryKey: ['savedJobs', user?.email],
    queryFn: () => base44.entities.SavedJob.filter({ user_email: user?.email }),
    enabled: !!user?.email,
  });

  const { data: applications = [], isLoading: loadingApps } = useQuery({
    queryKey: ['applications', user?.email],
    queryFn: () => base44.entities.Application.filter({ applicant_email: user?.email }),
    enabled: !!user?.email,
  });

  const { data: allJobs = [] } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => base44.entities.Job.filter({ status: 'active' }, '-created_date', 200),
  });

  const savedJobIds = useMemo(() => new Set(savedJobs.map(s => s.job_id)), [savedJobs]);
  const appliedJobIds = useMemo(() => new Set(applications.map(a => a.job_id)), [applications]);

  const savedJobsList = useMemo(() => {
    return allJobs
      .filter(j => savedJobIds.has(String(j.id)))
      .map(j => ({
        ...j,
        _dist: userLocation?.latitude
          ? getDistance(userLocation.latitude, userLocation.longitude, j.latitude, j.longitude)
          : Infinity,
      }));
  }, [allJobs, savedJobIds, userLocation, getDistance]);

  const appliedJobsList = useMemo(() => {
    return allJobs
      .filter(j => appliedJobIds.has(String(j.id)))
      .map(j => ({
        ...j,
        _dist: userLocation?.latitude
          ? getDistance(userLocation.latitude, userLocation.longitude, j.latitude, j.longitude)
          : Infinity,
      }));
  }, [allJobs, appliedJobIds, userLocation, getDistance]);

  const toggleSave = useMutation({
    mutationFn: async (job) => {
      const existing = savedJobs.find(s => s.job_id === String(job.id));
      if (existing) {
        await base44.entities.SavedJob.delete(existing.id);
      } else {
        await base44.entities.SavedJob.create({ job_id: String(job.id), user_email: user.email });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedJobs'] }),
  });

  const currentList = tab === 'saved' ? savedJobsList : appliedJobsList;
  const isLoading = tab === 'saved' ? loadingSaved : loadingApps;

  return (
    <div className="px-4 pt-4">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">{t('saved')}</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setTab('saved')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
            tab === 'saved'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          {t('saved_jobs')}
        </button>
        <button
          onClick={() => setTab('applied')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
            tab === 'applied'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          {t('applied_jobs')}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
        </div>
      ) : currentList.length === 0 ? (
        <div className="text-center py-20">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">{t('no_saved_jobs')}</p>
        </div>
      ) : (
        <div className="space-y-3 pb-4">
          {currentList.map(job => (
            <JobCard
              key={job.id}
              job={job}
              distance={job._dist}
              isSaved={savedJobIds.has(String(job.id))}
              onToggleSave={() => toggleSave.mutate(job)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
