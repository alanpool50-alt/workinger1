import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLanguage } from '../components/i18n/LanguageContext';
import { ArrowLeft, Upload, CheckCircle, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';

export default function Apply() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('id');

  const [message, setMessage] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [sent, setSent] = useState(false);

  const { data: job } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => base44.entities.Job.filter({ id: jobId }),
    select: (d) => d?.[0],
    enabled: !!jobId,
  });

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const submitApp = useMutation({
    mutationFn: async () => {
      await base44.entities.Application.create({
        job_id: String(jobId),
        applicant_email: user.email,
        employer_email: job?.posted_by || '',
        message,
        resume_url: resumeUrl,
        job_title: job?.title || '',
        company: job?.company || '',
        status: 'pending',
      });
    },
    onSuccess: () => setSent(true),
  });

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setResumeUrl(file_url);
    setResumeName(file.name);
    setUploading(false);
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      >
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('application_sent')}</h2>
        <p className="text-slate-500 mb-8">{t('employer_will_review')}</p>
        <Button
          onClick={() => navigate('/Explore')}
          className="h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-8"
        >
          {t('back_to_jobs')}
        </Button>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
        <h1 className="font-semibold text-slate-900">{t('apply_for_job')}</h1>
      </div>

      <div className="px-4 pt-6 space-y-6">
        {job && (
          <div className="bg-slate-50 rounded-2xl p-4">
            <h3 className="font-semibold text-slate-900">{job.title}</h3>
            <p className="text-sm text-slate-500">{job.company}</p>
          </div>
        )}

        {/* Resume Upload */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">{t('select_resume')}</label>
          <label className="flex items-center gap-3 p-4 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-indigo-300 transition-colors">
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
            ) : resumeUrl ? (
              <FileText className="w-5 h-5 text-indigo-500" />
            ) : (
              <Upload className="w-5 h-5 text-slate-400" />
            )}
            <span className="text-sm text-slate-600">
              {resumeName || t('upload_resume')}
            </span>
            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
          </label>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">{t('write_message')}</label>
          <Textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={t('write_message')}
            rows={5}
            className="rounded-xl resize-none"
          />
        </div>

        <Button
          onClick={() => submitApp.mutate()}
          disabled={submitApp.isPending}
          className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-base font-semibold"
        >
          {submitApp.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            t('send_application')
          )}
        </Button>
      </div>
    </div>
  );
}
