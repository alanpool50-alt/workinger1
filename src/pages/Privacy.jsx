import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLanguage } from '../components/i18n/LanguageContext';
import { ArrowLeft, Shield, Eye, EyeOff, Lock, Loader2, Save } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Privacy() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const [privacy, setPrivacy] = useState({
    profile_visible: true,
    show_email: false,
    allow_messages: true,
  });

  React.useEffect(() => {
    if (user?.privacy_settings) {
      setPrivacy(user.privacy_settings);
    }
  }, [user]);

  const savePrivacy = useMutation({
    mutationFn: () => base44.auth.updateMe({ privacy_settings: privacy }),
    onSuccess: () => {
      toast.success('Privacy settings saved');
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
      key: 'profile_visible',
      label: 'Public Profile',
      description: 'Make your profile visible to employers',
      icon: Eye,
    },
    {
      key: 'show_email',
      label: 'Show Email',
      description: 'Display email on your public profile',
      icon: Eye,
    },
    {
      key: 'allow_messages',
      label: 'Allow Messages',
      description: 'Let employers send you messages',
      icon: Lock,
    },
  ];

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">{t('privacy')}</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5" />
            Privacy Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {settings.map(setting => {
            const Icon = setting.icon;
            return (
              <div key={setting.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-start gap-3 flex-1 pr-4">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{setting.label}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{setting.description}</p>
                  </div>
                </div>
                <Switch
                  checked={privacy[setting.key]}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, [setting.key]: checked }))}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Data & Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600">
          <p>Your data is protected and will only be used for job matching and communications with employers.</p>
          <p>We do not share your information with third parties without your consent.</p>
          <p>You can request data deletion at any time by contacting support.</p>
        </CardContent>
      </Card>

      <Button
        onClick={() => savePrivacy.mutate()}
        disabled={savePrivacy.isPending}
        className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-base font-semibold"
      >
        {savePrivacy.isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Save className="w-5 h-5 mr-2" />
            Save Privacy Settings
          </>
        )}
      </Button>
    </div>
  );
}
