import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tantml:react-query';
import { useLanguage } from '../components/i18n/LanguageContext';
import { Link } from 'react-router-dom';
import { Briefcase, Eye, Users, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import moment from 'moment';

export default function ManageJobs() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['my-jobs', user?.email],
    queryFn: () => base44.entities.Job.filter({ posted_by: user?.email }, '-created_date', 100),
    enabled: !!user?.email,
  });

  const deleteJob = useMutation({
    mutationFn: (id) => base44.entities.Job.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-jobs'] }),
  });

  const toggleStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Job.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-jobs'] }),
  });

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Posted Jobs</h1>
        <Link to="/PostJob">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Post Job
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 mb-4">No jobs posted yet</p>
          <Link to="/PostJob">
            <Button className="bg-indigo-600 hover:bg-indigo-700">Post Your First Job</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <Card key={job.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-slate-900">{job.title}</h3>
                  <p className="text-sm text-slate-500">{job.company}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  job.status === 'active' ? 'bg-green-100 text-green-700' :
                  job.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {job.status}
                </span>
              </div>

              <div className="flex items-center gap-6 text-sm text-slate-500 mb-4">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {job.views_count || 0} views
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {job.applications_count || 0} applications
                </div>
                <span>{moment(job.created_date).fromNow()}</span>
              </div>

              <div className="flex items-center gap-2">
                <Link to={`/JobDetails?id=${job.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => toggleStatus.mutate({
                    id: job.id,
                    status: job.status === 'active' ? 'closed' : 'active'
                  })}
                >
                  {job.status === 'active' ? 'Close' : 'Reopen'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => deleteJob.mutate(job.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
