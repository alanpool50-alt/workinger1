import React from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../components/i18n/LanguageContext';
import { MessageCircle, Briefcase, Loader2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import moment from 'moment';

export default function Messages() {
  const { t, isRTL } = useLanguage();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations', user?.email],
    queryFn: async () => {
      const all = await base44.entities.Conversation.list('-updated_date', 50);
      return all.filter(c => c.participants?.includes(user?.email));
    },
    enabled: !!user?.email,
  });

  const typeIcons = {
    interview_invitation: '📋',
    job_discussion: '💼',
    general: '💬',
  };

  return (
    <div className="px-4 pt-4">
      <h1 className="text-2xl font-bold text-slate-900 mb-5">{t('messages')}</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-20">
          <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">{t('no_messages')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map(conv => {
            const otherEmail = conv.participants?.find(p => p !== user?.email) || '';
            return (
              <Link key={conv.id} to={`/Chat?conversationId=${conv.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-sm transition-all"
                >
                  <div className="w-11 h-11 rounded-full bg-indigo-50 flex items-center justify-center text-lg shrink-0">
                    {typeIcons[conv.type] || '💬'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-medium text-slate-900 text-sm truncate">
                        {conv.job_title || otherEmail}
                      </span>
                      {conv.last_message_date && (
                        <span className="text-xs text-slate-400 shrink-0">
                          {moment(conv.last_message_date).fromNow()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 truncate">
                      {conv.last_message || t('job_discussion')}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-300 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                </motion.div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
