import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '../components/i18n/LanguageContext';
import { useLocation } from '../components/i18n/LocationContext';
import JobCard from '../components/jobs/JobCard';
import JobFiltersSheet from '../components/jobs/JobFiltersSheet';
import LocationAutocomplete from '../components/shared/LocationAutocomplete';
import LanguageSwitcher from '../components/shared/LanguageSwitcher';
import { Search, SlidersHorizontal, MapPin, Loader2, Navigation } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const RADIUS_OPTIONS = [10, 25, 50, 100];

export default function Explore() {
  const { t } = useLanguage();
  const { userLocation, isDetecting, getDistance } = useLocation();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [activeSection, setActiveSection] = useState('near');

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => base44.entities.Job.filter({ status: 'active' }, '-created_date', 100),
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

  const savedJobIds = useMemo(() => new Set(savedJobs.map(s => s.job_id)), [savedJobs]);

  const toggleSave = useMutation({
    mutationFn: async (job) => {
      const existing = savedJobs.find(s => s.job_id === String(job.id));
      if (existing) {
        await base44.entities.SavedJob.delete(existing.id);
      } else {
        await base44.entities.SavedJob.create({
          job_id: String(job.id),
          user_email: user.email,
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savedJobs'] }),
  });

  // Calculate distances
  const jobsWithDistance = useMemo(() => {
    const loc = locationFilter || userLocation;
    if (!loc?.latitude || !loc?.longitude) return jobs.map(j => ({ ...j, _dist: Infinity }));
    return jobs.map(j => ({
      ...j,
      _dist: getDistance(loc.latitude, loc.longitude, j.latitude, j.longitude),
    }));
  }, [jobs, userLocation, locationFilter, getDistance]);

  // Filter and categorize
  const filteredJobs = useMemo(() => {
    let result = jobsWithDistance;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(j =>
        j.title?.toLowerCase().includes(q) ||
        j.company?.toLowerCase().includes(q) ||
        j.location_name?.toLowerCase().includes(q)
      );
    }

    if (filters.job_type) result = result.filter(j => j.job_type === filters.job_type);
    if (filters.is_remote) result = result.filter(j => j.is_remote);
    if (filters.experience_level) result = result.filter(j => j.experience_level === filters.experience_level);

    return result;
  }, [jobsWithDistance, searchQuery, filters]);

  const radius = filters.radius || 50;
  const nearbyJobs = filteredJobs.filter(j => !j.is_remote && j._dist <= radius).sort((a, b) => a._dist - b._dist);
  const remoteJobs = filteredJobs.filter(j => j.is_remote);
  const recentJobs = [...filteredJobs].sort((a, b) => new Date(b.created_date) - new Date(a.created_date)).slice(0, 20);

  const sections = {
    near: { label: t('jobs_near_you'), data: nearbyJobs },
    remote: { label: t('remote_jobs'), data: remoteJobs },
    recent: { label: t('recently_posted'), data: recentJobs },
  };

  const currentJobs = sections[activeSection]?.data || [];

  return (
    <div className="px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workinger</h1>
          {userLocation?.city && !isDetecting && (
            <div className="flex items-center gap-1 text-sm text-slate-500 mt-0.5">
              <MapPin className="w-3 h-3" />
              <span>{userLocation.city}, {userLocation.country}</span>
            </div>
          )}
          {isDetecting && (
            <div className="flex items-center gap-1 text-sm text-slate-400 mt-0.5">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>{t('detecting_location')}</span>
            </div>
          )}
        </div>
        <LanguageSwitcher />
      </div>

      {/* Search bar */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('search_jobs')}
            className="pl-9 h-12 rounded-xl bg-white border-slate-200"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(true)}
          className="h-12 w-12 rounded-xl border-slate-200 shrink-0"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Location autocomplete */}
      <LocationAutocomplete
        value={locationFilter?.name || ''}
        onChange={(loc) => setLocationFilter(loc)}
        className="mb-4"
      />

      {/* Section tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
        {Object.entries(sections).map(([key, sec]) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeSection === key
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {sec.label}
            <span className="ml-1.5 text-xs opacity-70">({sec.data.length})</span>
          </button>
        ))}
      </div>

      {/* Job list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
        </div>
      ) : currentJobs.length === 0 ? (
        <div className="text-center py-20">
          <Navigation className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">{t('no_results')}</p>
        </div>
      ) : (
        <div className="space-y-3 pb-4">
          {currentJobs.map(job => (
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

      <JobFiltersSheet
        open={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApply={setFilters}
      />
    </div>
  );
}
