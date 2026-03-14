import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '../components/i18n/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import moment from 'moment';

export default function Notifications() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.email],
    queryFn: () => base44.entities.Notification.filter({ user_email: user?.email }, '-created_date', 100),
    enabled: !!user?.email,
  });

  const markRead = useMutation({
    mutationFn: (id) => base44.entities.Notification.update(id, { read: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      for (const notif of notifications.filter(n => !n.read)) {
        await base44.entities.Notification.update(notif.id, { read: true });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const handleNotificationClick = (notif) => {
    if (!notif.read) markRead.mutate(notif.id);
    if (notif.action_url) navigate(notif.action_url);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-slate-500 mt-1">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark all read
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(notif => (
            <button
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                notif.read
                  ? 'bg-white border-slate-100'
                  : 'bg-indigo-50 border-indigo-200 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>
                    {notif.title}
                  </p>
                  <p className={`text-sm mt-1 ${notif.read ? 'text-slate-500' : 'text-slate-600'}`}>
                    {notif.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    {moment(notif.created_date).fromNow()}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
