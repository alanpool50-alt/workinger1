import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  Users, Briefcase, Building2, FileText, MessageSquare,
  MapPin, Bell, TrendingUp, BarChart3, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Admin() {
  const { data: jobs = [] } = useQuery({
    queryKey: ['admin-jobs'],
    queryFn: () => base44.entities.Job.list('-created_date', 1000),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => base44.entities.User.list('-created_date', 1000),
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['admin-applications'],
    queryFn: () => base44.entities.Application.list('-created_date', 1000),
  });

  const { data: companies = [] } = useQuery({
    queryKey: ['admin-companies'],
    queryFn: () => base44.entities.Company.list('-created_date', 1000),
  });

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'bg-blue-500' },
    { label: 'Active Jobs', value: jobs.filter(j => j.status === 'active').length, icon: Briefcase, color: 'bg-green-500' },
    { label: 'Applications', value: applications.length, icon: FileText, color: 'bg-purple-500' },
    { label: 'Companies', value: companies.length, icon: Building2, color: 'bg-orange-500' },
  ];

  const entities = [
    { name: 'Users', icon: Users, count: users.length, path: '/admin/users' },
    { name: 'Jobs', icon: Briefcase, count: jobs.length, path: '/admin/jobs' },
    { name: 'Companies', icon: Building2, count: companies.length, path: '/admin/companies' },
    { name: 'Applications', icon: FileText, count: applications.length, path: '/admin/applications' },
    { name: 'Messages', icon: MessageSquare, path: '/admin/messages' },
    { name: 'Cities', icon: MapPin, path: '/admin/cities' },
    { name: 'Notifications', icon: Bell, path: '/admin/notifications' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-500">Workinger Platform Administration</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.color} bg-opacity-10 flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Entity Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Manage Entities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {entities.map(entity => {
                const Icon = entity.icon;
                return (
                  <Link key={entity.name} to={entity.path}>
                    <div className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all hover:border-indigo-300">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{entity.name}</p>
                          {entity.count !== undefined && (
                            <p className="text-sm text-slate-500">{entity.count} records</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {jobs.slice(0, 5).map(job => (
                  <div key={job.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{job.title}</p>
                      <p className="text-sm text-slate-500 truncate">{job.company}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recent Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {applications.slice(0, 5).map(app => (
                  <div key={app.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{app.job_title}</p>
                      <p className="text-sm text-slate-500 truncate">{app.applicant_email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      app.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                      app.status === 'viewed' ? 'bg-purple-100 text-purple-700' :
                      app.status === 'interview' ? 'bg-orange-100 text-orange-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
