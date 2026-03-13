import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Bookmark, BookmarkCheck, Briefcase } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { motion } from 'framer-motion';

export default function JobCard({ job, distance, isSaved, onToggleSave }) {
  const { t } = useLanguage();

  const typeLabel = {
    full_time: t('full_time'),
    part_time: t('part_time'),
    contract: t('contract'),
    freelance: t('freelance'),
    internship: t('internship'),
  };

  const timeSince = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return t('today');
    if (days === 1) return t('yesterday');
    return `${days} ${t('days_ago')}`;
  };

  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return null;
    const cur = job.salary_currency || 'USD';
    if (job.salary_min && job.salary_max) {
      return `${cur} ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`;
    }
    if (job.salary_min) return `${cur} ${job.salary_min.toLocaleString()}+`;
    return `${cur} ${job.salary_max.toLocaleString()}`;
  };

  const salary = formatSalary();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <Link to={`/JobDetails?id=${job.id}`} className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {job.company_logo_url ? (
              <img
                src={job.company_logo_url}
                alt={job.company}
                className="w-10 h-10 rounded-xl object-cover bg-slate-100"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-indigo-500" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">{job.title}</h3>
              <p className="text-sm text-slate-500 truncate">{job.company}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              <MapPin className="w-3 h-3" />
              {job.is_remote ? t('remote') : job.location_name}
            </span>
            {job.job_type && (
              <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full">
                {typeLabel[job.job_type] || job.job_type}
              </span>
            )}
            {distance !== undefined && distance !== Infinity && (
              <span className="text-xs bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full">
                {Math.round(distance)} {t('km_away')}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-3">
            {salary && (
              <span className="text-sm font-semibold text-slate-800">{salary}</span>
            )}
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              {timeSince(job.created_date)}
            </span>
          </div>
        </Link>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSave?.(job);
          }}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors shrink-0"
        >
          {isSaved ? (
            <BookmarkCheck className="w-5 h-5 text-indigo-600 fill-indigo-600" />
          ) : (
            <Bookmark className="w-5 h-5 text-slate-300" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
