import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '../components/i18n/LanguageContext';
import { ArrowLeft, Send, Paperclip, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Chat() {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const bottomRef = useRef(null);
  const [newMsg, setNewMsg] = useState('');

  const urlParams = new URLSearchParams(window.location.search);
  const conversationId = urlParams.get('conversationId');
  const jobId = urlParams.get('jobId');
  const employer = urlParams.get('employer');

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  // Find or create conversation
  const [convId, setConvId] = useState(conversationId);

  useEffect(() => {
    if (!conversationId && jobId && employer && user?.email) {
      // Look for existing conversation
      base44.entities.Conversation.list('-updated_date', 200).then(all => {
        const existing = all.find(
          c => c.job_id === jobId && c.participants?.includes(user.email) && c.participants?.includes(employer)
        );
        if (existing) {
          setConvId(existing.id);
        }
      });
    }
  }, [conversationId, jobId, employer, user?.email]);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', convId],
    queryFn: () => base44.entities.Message.filter({ conversation_id: String(convId) }, 'created_date', 200),
    enabled: !!convId,
    refetchInterval: 5000,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useMutation({
    mutationFn: async () => {
      let currentConvId = convId;

      // Create conversation if doesn't exist
      if (!currentConvId && employer && user?.email) {
        const conv = await base44.entities.Conversation.create({
          participants: [user.email, employer],
          job_id: jobId || '',
          job_title: '',
          type: 'job_discussion',
          last_message: newMsg,
          last_message_date: new Date().toISOString(),
        });
        currentConvId = conv.id;
        setConvId(conv.id);
      }

      await base44.entities.Message.create({
        conversation_id: String(currentConvId),
        sender_email: user.email,
        content: newMsg,
      });

      // Update conversation
      if (currentConvId) {
        await base44.entities.Conversation.update(currentConvId, {
          last_message: newMsg,
          last_message_date: new Date().toISOString(),
        });
      }

      setNewMsg('');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', convId] });
    },
  });

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
        <h1 className="font-semibold text-slate-900">{employer || t('messages')}</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender_email === user?.email;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-indigo-600 text-white rounded-br-md'
                    : 'bg-slate-100 text-slate-800 rounded-bl-md'
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-100 bg-white px-4 py-3 pb-24">
        <div className="flex items-center gap-2">
          <Input
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            placeholder={t('type_message')}
            className="h-11 rounded-full bg-slate-50 border-slate-200"
            onKeyDown={e => {
              if (e.key === 'Enter' && newMsg.trim()) sendMessage.mutate();
            }}
          />
          <Button
            onClick={() => newMsg.trim() && sendMessage.mutate()}
            disabled={!newMsg.trim() || sendMessage.isPending}
            size="icon"
            className="h-11 w-11 rounded-full bg-indigo-600 hover:bg-indigo-700 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
