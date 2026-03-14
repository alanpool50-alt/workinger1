import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '../components/i18n/LanguageContext';
import { FileText, Download, MessageCircle, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import moment from 'moment';

export default function Applicants() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['employer-applications', user?.email],
    queryFn: () => base44.entities.Application.filter({ employer_email: user?.email }, '-created_date', 200),
    enabled: !!user?.email,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Application.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employer-applications'] }),
  });

  const filteredApps = statusFilter === 'all'
    ? applications
    : applications.filter(a => a.status === statusFilter);

  const statusColors = {
    sent: 'bg-blue-100 text-blue-700',
    viewed: 'bg-purple-100 text-purple-700',
    interview: 'bg-orange-100 text-orange-700',
    offer: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    accepted: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Applicants</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="viewed">Viewed</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="offer">Offer</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No applications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApps.map(app => (
            <Card key={app.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{app.job_title}</h3>
                  <p className="text-sm text-slate-500">{app.applicant_email}</p>
                  <p className="text-xs text-slate-400 mt-1">{moment(app.created_date).fromNow()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                  {app.status}
                </span>
              </div>

              {app.message && (
                <p className="text-sm text-slate-600 mb-4 p-3 bg-slate-50 rounded-lg">
                  {app.message}
                </p>
              )}

              <div className="flex items-center gap-2">
                {app.resume_url && (
                  <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Resume
                    </Button>
                  </a>
                )}
                {app.status === 'sent' && (
                  <Button
                    variant="outline"
                    onClick={() => updateStatus.mutate({ id: app.id, status: 'interview' })}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Interview
                  </Button>
                )}
                {app.status === 'interview' && (
                  <Button
                    onClick={() => updateStatus.mutate({ id: app.id, status: 'offer' })}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Send Offer
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => updateStatus.mutate({ id: app.id, status: 'rejected' })}
                  className="text-red-600"
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
