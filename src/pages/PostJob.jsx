import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLanguage } from '../components/i18n/LanguageContext';
import LocationAutocomplete from '../components/shared/LocationAutocomplete';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PostJob() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [published, setPublished] = useState(false);
  const [location, setLocation] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const [form, setForm] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    job_type: 'full_time',
    experience_level: 'mid',
    is_remote: false,
    salary_min: '',
    salary_max: '',
    salary_currency: 'USD',
  });

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const publish = useMutation({
    mutationFn: async () => {
      await base44.entities.Job.create({
        ...form,
        salary_min: form.salary_min ? Number(form.salary_min) : undefined,
        salary_max: form.salary_max ? Number(form.salary_max) : undefined,
        location_name: location?.name || '',
        country_code: location?.country_code || '',
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0,
        posted_by: user?.email || '',
        status: 'active',
      });
    },
    onSuccess: () => setPublished(true),
  });

  if (published) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      >
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('job_published')}</h2>
        <Button
          onClick={() => navigate('/Explore')}
          className="mt-6 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-8"
        >
          {t('back_to_jobs')}
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">{t('create_job')}</h1>

      <div className="space-y-5">
        <div>
          <Label className="text-sm font-semibold text-slate-700">{t('job_title')}</Label>
          <Input
            value={form.title}
            onChange={e => update('title', e.target.value)}
            className="mt-1.5 h-12 rounded-xl"
            placeholder={t('job_title')}
          />
        </div>

        <div>
          <Label className="text-sm font-semibold text-slate-700">{t('company_name')}</Label>
          <Input
            value={form.company}
            onChange={e => update('company', e.target.value)}
            className="mt-1.5 h-12 rounded-xl"
            placeholder={t('company_name')}
          />
        </div>

        <div>
          <Label className="text-sm font-semibold text-slate-700">{t('location')}</Label>
          <LocationAutocomplete
            value={location?.name || ''}
            onChange={setLocation}
            className="mt-1.5"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-slate-700">{t('remote')}</Label>
          <Switch checked={form.is_remote} onCheckedChange={v => update('is_remote', v)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm font-semibold text-slate-700">{t('job_type')}</Label>
            <Select value={form.job_type} onValueChange={v => update('job_type', v)}>
              <SelectTrigger className="mt-1.5 h-12 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="full_time">{t('full_time')}</SelectItem>
                <SelectItem value="part_time">{t('part_time')}</SelectItem>
                <SelectItem value="contract">{t('contract')}</SelectItem>
                <SelectItem value="freelance">{t('freelance')}</SelectItem>
                <SelectItem value="internship">{t('internship')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-semibold text-slate-700">{t('experience_level')}</Label>
            <Select value={form.experience_level} onValueChange={v => update('experience_level', v)}>
              <SelectTrigger className="mt-1.5 h-12 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">{t('entry_level')}</SelectItem>
                <SelectItem value="mid">{t('mid_level')}</SelectItem>
                <SelectItem value="senior">{t('senior_level')}</SelectItem>
                <SelectItem value="executive">{t('executive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold text-slate-700">{t('salary_range')}</Label>
          <div className="grid grid-cols-2 gap-3 mt-1.5">
            <Input
              type="number"
              value={form.salary_min}
              onChange={e => update('salary_min', e.target.value)}
              placeholder={t('min_salary')}
              className="h-12 rounded-xl"
            />
            <Input
              type="number"
              value={form.salary_max}
              onChange={e => update('salary_max', e.target.value)}
              placeholder={t('max_salary')}
              className="h-12 rounded-xl"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold text-slate-700">{t('job_description')}</Label>
          <Textarea
            value={form.description}
            onChange={e => update('description', e.target.value)}
            placeholder={t('job_description')}
            rows={5}
            className="mt-1.5 rounded-xl resize-none"
          />
        </div>

        <div>
          <Label className="text-sm font-semibold text-slate-700">{t('requirements')}</Label>
          <Textarea
            value={form.requirements}
            onChange={e => update('requirements', e.target.value)}
            placeholder={t('requirements')}
            rows={4}
            className="mt-1.5 rounded-xl resize-none"
          />
        </div>

        <Button
          onClick={() => publish.mutate()}
          disabled={!form.title || !form.company || publish.isPending}
          className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-base font-semibold mt-2"
        >
          {publish.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            t('publish_job')
          )}
        </Button>
      </div>
    </div>
  );
}
