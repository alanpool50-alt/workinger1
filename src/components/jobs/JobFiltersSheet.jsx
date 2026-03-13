import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const JOB_TYPES = ['full_time', 'part_time', 'contract', 'freelance', 'internship'];
const EXP_LEVELS = ['entry', 'mid', 'senior', 'executive'];

export default function JobFiltersSheet({ open, onClose, filters, onApply }) {
  const { t } = useLanguage();
  const [local, setLocal] = useState(filters || {});

  const toggle = (key, value) => {
    setLocal(prev => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  const handleApply = () => {
    onApply(local);
    onClose();
  };

  const handleClear = () => {
    setLocal({});
    onApply({});
    onClose();
  };

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
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl">{t('filters')}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-2">
          {/* Job Type */}
          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-3 block">{t('job_type')}</Label>
            <div className="flex flex-wrap gap-2">
              {JOB_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => toggle('job_type', type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    local.job_type === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {typeLabels[type]}
                </button>
              ))}
            </div>
          </div>

          {/* Remote toggle */}
          <div>
            <button
              onClick={() => setLocal(prev => ({ ...prev, is_remote: !prev.is_remote }))}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                local.is_remote
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t('remote')}
            </button>
          </div>

          {/* Experience Level */}
          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-3 block">{t('experience_level')}</Label>
            <div className="flex flex-wrap gap-2">
              {EXP_LEVELS.map(level => (
                <button
                  key={level}
                  onClick={() => toggle('experience_level', level)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    local.experience_level === level
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {expLabels[level]}
                </button>
              ))}
            </div>
          </div>

          {/* Radius */}
          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-3 block">
              {t('radius')}: {local.radius || 50} km
            </Label>
            <Slider
              value={[local.radius || 50]}
              onValueChange={([v]) => setLocal(prev => ({ ...prev, radius: v }))}
              min={5}
              max={200}
              step={5}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>5 km</span>
              <span>200 km</span>
            </div>
          </div>
        </div>

        <SheetFooter className="flex gap-3 pt-4">
          <Button variant="outline" onClick={handleClear} className="flex-1">
            {t('clear_filters')}
          </Button>
          <Button onClick={handleApply} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
            {t('apply_filters')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
