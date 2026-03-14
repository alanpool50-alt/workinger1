import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLanguage } from '../components/i18n/LanguageContext';
import { ArrowLeft, User, Mail, Briefcase, Loader2, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function Account() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const [form, setForm] = useState({
    title: user?.title || '',
    location: user?.location || '',
  });

  React.useEffect(() => {
    if (user) {
      setForm({
        title: user.title || '',
        location: user.location || '',
      });
    }
  }, [user]);

  const saveAccount = useMutation({
    mutationFn: () => base44.auth.updateMe(form),
    onSuccess: () => {
      toast.success('Account settings saved');
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">{t('account')}</h1>
      </div>

      <div className="space-y-5">
        <div>
          <Label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {t('email')}
          </Label>
          <Input value={user?.email || ''} disabled className="bg-slate-50" />
          <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <Label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            Full Name
          </Label>
          <Input value={user?.full_name || ''} disabled className="bg-slate-50" />
          <p className="text-xs text-slate-500 mt-1">Name is managed by authentication system</p>
        </div>

        <div>
          <Label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Professional Title
          </Label>
          <Input
            value={form.title}
            onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g. Frontend Developer"
            className="h-12 rounded-xl"
          />
        </div>

        <div>
          <Label className="text-sm font-semibold text-slate-700 mb-2">Location</Label>
          <Input
            value={form.location}
            onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))}
            placeholder="City, Country"
            className="h-12 rounded-xl"
          />
        </div>

        <div>
          <Label className="text-sm font-semibold text-slate-700 mb-2">Account Role</Label>
          <Select value={user?.role || 'candidate'} disabled>
            <SelectTrigger className="h-12 rounded-xl bg-slate-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="candidate">Candidate</SelectItem>
              <SelectItem value="employer">Employer</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 mt-1">Contact support to change your role</p>
        </div>

        <Button
          onClick={() => saveAccount.mutate()}
          disabled={saveAccount.isPending}
          className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-base font-semibold"
        >
          {saveAccount.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              {t('save_profile')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
