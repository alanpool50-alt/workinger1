import React from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../components/i18n/LanguageContext';
import { 
  Briefcase, 
  Users, 
  MessageSquare, 
  Eye, 
  Plus,
  TrendingUp,
  Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EmployerDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['employerJobs', user?.email],
    queryFn: () => base44.entities.Job.filter({ posted_by: user?.email }),
    enabled: !!user?.email,
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['employerApplications', user?.email],
    queryFn: () => base44.entities.Application.filter({ employer_email: user?.email }),
    enabled: !!user?.email,
  });

  const { data: conversations = [] } = useQuery({
    queryKey: ['employerConversations', user?.email],
    queryFn: async () => {
      const all = await base44.entities.Conversation.list('-last_message_date', 50);
      return all.filter(c => c.participants?.includes(user?.email));
    },
    enabled: !!user?.email,
  });

  const activeJobs = jobs.filter(j => j.status === 'active');
  const totalViews = jobs.reduce((sum, j) => sum + (j.views_count || 0), 0);
  const totalApplications = applications.length;
  const unreadMessages = conversations.filter(c => !c.read).length;

  const stats = [
    { label: 'Active Jobs', value: activeJobs.length, icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Total Applications', value: totalApplications, icon: Users, color: 'bg-green-500' },
    { label: 'Total Views', value: totalViews, icon: Eye, color: 'bg-purple-500' },
    { label: 'Unread Messages', value: unreadMessages, icon: MessageSquare, color: 'bg-orange-500' },
  ];

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
        <h1 className="text-2xl font-bold text-slate-900">Employer Dashboard</h1>
        <Button
          onClick={() => navigate('/PostJob')}
          className="bg-indigo-600 hover:bg-indigo-700 rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('post_job')}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-slate-100">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start h-12 rounded-xl"
            onClick={() => navigate('/ManageJobs')}
          >
            <Briefcase className="w-4 h-4 mr-3" />
            Manage Jobs
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start h-12 rounded-xl"
            onClick={() => navigate('/Applicants')}
          >
            <Users className="w-4 h-4 mr-3" />
            View Applicants
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start h-12 rounded-xl"
            onClick={() => navigate('/Messages')}
          >
            <MessageSquare className="w-4 h-4 mr-3" />
            Messages
          </Button>
        </CardContent>
      </Card>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeJobs.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No active jobs yet</p>
          ) : (
            <div className="space-y-3">
              {activeJobs.slice(0, 5).map(job => (
                <div
                  key={job.id}
                  onClick={() => navigate(`/JobDetails?id=${job.id}`)}
                  className="p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <p className="font-medium text-slate-900">{job.title}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                    <span>{job.applications_count || 0} applications</span>
                    <span>{job.views_count || 0} views</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
