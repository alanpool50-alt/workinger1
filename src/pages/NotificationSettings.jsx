import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLanguage } from '../components/i18n/LanguageContext';
import { ArrowLeft, Bell, Loader2, Save } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function NotificationSettings() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const [prefs, setPrefs] = useState({
    job_matches: true,
    application_updates: true,
    messages: true,
  });

  React.useEffect(() => {
    if (user?.notification_preferences) {
      setPrefs(user.notification_preferences);
    }
  }, [user]);

  const savePrefs = useMutation({
    mutationFn: () => base44.auth.updateMe({ notification_preferences: prefs }),
    onSuccess: () => {
      toast.success('Notification preferences saved');
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  const settings = [
    {
      key: 'job_matches',
      label: 'Job Match Alerts',
      description: 'Get notified when new jobs match your preferences',
    },
    {
      key: 'application_updates',
      label: 'Application Updates',
      description: 'Updates on your job applications status',
    },
    {
      key: 'messages',
      label: 'Messages',
      description: 'New messages from employers',
    },
  ];

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">{t('notifications')}</h1>
      </div>

      <div className="space-y-1 mb-6">
        {settings.map(setting => (
          <div key={setting.key} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
            <div className="flex-1 pr-4">
              <p className="font-medium text-slate-900">{setting.label}</p>
              <p className="text-sm text-slate-500 mt-0.5">{setting.description}</p>
            </div>
            <Switch
              checked={prefs[setting.key]}
              onCheckedChange={(checked) => setPrefs(prev => ({ ...prev, [setting.key]: checked }))}
            />
          </div>
        ))}
      </div>

      <Button
        onClick={() => savePrefs.mutate()}
        disabled={savePrefs.isPending}
        className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-base font-semibold"
      >
        {savePrefs.isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Save className="w-5 h-5 mr-2" />
            Save Preferences
          </>
        )}
      </Button>
    </div>
  );
}
