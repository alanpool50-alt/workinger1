import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLanguage } from '../components/i18n/LanguageContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  User, Settings, Upload, Download, FileText,
  Loader2, CheckCircle, Briefcase
} from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const { t } = useLanguage();

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const [form, setForm] = useState({
    bio: '',
    skills: '',
    experience: '',
    education: '',
    resume_url: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        bio: user.bio || '',
        skills: user.skills || '',
        experience: user.experience || '',
        education: user.education || '',
        resume_url: user.resume_url || '',
      });
    }
  }, [user]);

  const [uploading, setUploading] = useState(false);

  const saveProfile = useMutation({
    mutationFn: () => base44.auth.updateMe(form),
    onSuccess: () => toast.success(t('saved_text')),
  });

  async function handleResumeUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(prev => ({ ...prev, resume_url: file_url }));
    setUploading(false);
  }

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('profile')}</h1>
        <Link to="/Settings" className="p-2 rounded-full hover:bg-slate-100">
          <Settings className="w-5 h-5 text-slate-500" />
        </Link>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{user?.full_name || 'User'}</h2>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <Label className="text-sm font-semibold text-slate-700">{t('bio')}</Label>
          <Textarea
            value={form.bio}
            onChange={e => update('bio', e.target.value)}
            placeholder={t('bio')}
            rows={3}
            className="mt-1.5 rounded-xl resize-none"
          />
        </div>

        <div>
          <Label className="text-sm font-semibold text-slate-700">{t('skills')}</Label>
          <Input
            value={form.skills}
            onChange={e => update('skills', e.target.value)}
            placeholder={t('skills')}
            className="mt-1.5 h-12 rounded-xl"
          />
        </div>

        <div>
          <Label className="text-sm font-semibold text-slate-700">{t('experience')}</Label>
          <Textarea
            value={form.experience}
            onChange={e => update('experience', e.target.value)}
            placeholder={t('experience')}
            rows={3}
            className="mt-1.5 rounded-xl resize-none"
          />
        </div>

        <div>
          <Label className="text-sm font-semibold text-slate-700">{t('education')}</Label>
          <Textarea
            value={form.education}
            onChange={e => update('education', e.target.value)}
            placeholder={t('education')}
            rows={3}
            className="mt-1.5 rounded-xl resize-none"
          />
        </div>

        {/* Resume */}
        <div>
          <Label className="text-sm font-semibold text-slate-700 mb-2 block">Resume / CV</Label>
          {form.resume_url ? (
            <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
              <FileText className="w-5 h-5 text-indigo-500" />
              <span className="text-sm text-slate-700 flex-1 truncate">{t('download_resume')}</span>
              <a
                href={form.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
              </a>
              <label className="text-indigo-600 text-sm font-medium cursor-pointer">
                {t('replace_resume')}
                <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
              </label>
            </div>
          ) : (
            <label className="flex items-center gap-3 p-4 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-300 transition-colors">
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
              ) : (
                <Upload className="w-5 h-5 text-slate-400" />
              )}
              <span className="text-sm text-slate-500">{t('upload_resume')}</span>
              <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
            </label>
          )}
        </div>

        <Button
          onClick={() => saveProfile.mutate()}
          disabled={saveProfile.isPending}
          className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-base font-semibold"
        >
          {saveProfile.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            t('save_profile')
          )}
        </Button>
      </div>
    </div>
  );
}
