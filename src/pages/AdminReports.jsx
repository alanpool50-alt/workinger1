import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle, XCircle, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export default function AdminReports() {
  const queryClient = useQueryClient();
  const [selectedReport, setSelectedReport] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => base44.entities.Report.list('-created_date', 100),
  });

  const updateReport = useMutation({
    mutationFn: ({ id, status, notes }) =>
      base44.entities.Report.update(id, {
        status,
        admin_notes: notes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setSelectedReport(null);
      setAdminNotes('');
    },
  });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewed: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    dismissed: 'bg-slate-100 text-slate-800',
  };

  const pendingReports = reports.filter(r => r.status === 'pending');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-24">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Content Reports</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{pendingReports.length}</p>
                <p className="text-xs text-slate-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{reports.filter(r => r.status === 'resolved').length}</p>
                <p className="text-xs text-slate-500">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {reports.map(report => (
          <Card key={report.id} className="border-slate-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={statusColors[report.status]}>{report.status}</Badge>
                    <Badge variant="outline">{report.type}</Badge>
                  </div>
                  <p className="font-medium text-slate-900">{report.reason}</p>
                  <p className="text-sm text-slate-500 mt-1">{report.details}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    Reported by: {report.reporter_email}
                  </p>
                </div>
              </div>
            </CardHeader>
            {report.status === 'pending' && (
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Admin notes..."
                    value={selectedReport === report.id ? adminNotes : ''}
                    onChange={e => {
                      setSelectedReport(report.id);
                      setAdminNotes(e.target.value);
                    }}
                    rows={2}
                    className="rounded-xl"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        updateReport.mutate({
                          id: report.id,
                          status: 'resolved',
                          notes: adminNotes,
                        })
                      }
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateReport.mutate({
                          id: report.id,
                          status: 'dismissed',
                          notes: adminNotes,
                        })
                      }
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Dismiss
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
            {report.admin_notes && (
              <CardContent className="pt-0">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-slate-700 mb-1">Admin Notes:</p>
                  <p className="text-sm text-slate-600">{report.admin_notes}</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {reports.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No reports yet</p>
        </div>
      )}
    </div>
  );
}
