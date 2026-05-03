import { useState, useEffect } from 'react';
import { Plus, FileText, Calendar, Activity, GraduationCap, Stethoscope, ChevronRight, X, Upload, Sparkles } from 'lucide-react';
import api from '../services/api';
import Badge from '../components/Badge';
import SlaBar from '../components/SlaBar';

const typeIcons = {
  'Attendance Correction': { icon: Calendar, color: 'from-blue-400 to-blue-600' },
  'Event Participation': { icon: Activity, color: 'from-violet-400 to-violet-600' },
  'Medical Leave': { icon: Stethoscope, color: 'from-rose-400 to-rose-600' },
  'Medical Leave (Phase 1)': { icon: Stethoscope, color: 'from-rose-400 to-rose-600' },
  'Bonafide Certificate': { icon: GraduationCap, color: 'from-emerald-400 to-emerald-600' },
};

export default function StudentDashboard({ user }) {
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [requestType, setRequestType] = useState('Attendance Correction');
  const [reasonRaw, setReasonRaw] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests');
      setRequests(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (requestType === 'Medical Leave Intimation') {
        await api.post('/medical/intimations', { fromDate, toDate, reasonRaw });
      } else {
        const formData = new FormData();
        formData.append('type', requestType);
        formData.append('reasonRaw', reasonRaw);
        if (file) formData.append('document', file);
        await api.post('/requests', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setShowModal(false);
      fetchRequests();
      setReasonRaw(''); setFile(null); setFromDate(''); setToDate('');
    } catch (err) {
      console.error(err);
      alert('Error submitting request');
    } finally { setSubmitting(false); }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => ['Pending', 'Under Review', 'Acknowledged'].includes(r.status)).length,
    approved: requests.filter(r => r.status === 'Approved').length,
    rejected: requests.filter(r => r.status === 'Rejected').length,
  };

  return (
    <div className="animate-fade-in">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-surface-900">
            Welcome back, <span className="gradient-text">{user.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-sm text-surface-700/60 mt-1">Here's an overview of your academic requests</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 sm:mt-0 group inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:bg-primary-700 hover:shadow-primary-500/40 transition-all text-sm"
        >
          <Plus className="h-4 w-4" />
          New Request
          <ChevronRight className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 stagger">
        {[
          { label: 'Total Requests', val: stats.total, color: 'from-primary-500 to-primary-600' },
          { label: 'Pending', val: stats.pending, color: 'from-amber-400 to-amber-500' },
          { label: 'Approved', val: stats.approved, color: 'from-emerald-400 to-emerald-500' },
          { label: 'Rejected', val: stats.rejected, color: 'from-red-400 to-red-500' },
        ].map((s, i) => (
          <div key={i} className="animate-slide-up bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-surface-700/60 uppercase tracking-wider">{s.label}</p>
            <p className={`text-3xl font-extrabold mt-1 bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Request List */}
      {requests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="bg-primary-50 inline-flex p-4 rounded-2xl mb-4">
            <FileText className="h-8 w-8 text-primary-400" />
          </div>
          <h3 className="text-lg font-bold text-surface-900">No requests yet</h3>
          <p className="mt-1 text-sm text-surface-700/60 max-w-sm mx-auto">Click the "New Request" button above to submit your first academic request.</p>
        </div>
      ) : (
        <div className="space-y-3 stagger">
          {requests.map((request) => {
            const typeConfig = typeIcons[request.type] || { icon: FileText, color: 'from-gray-400 to-gray-500' };
            const Icon = typeConfig.icon;
            return (
              <div key={request._id} className="animate-fade-in group bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-primary-200/50 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className={`bg-gradient-to-br ${typeConfig.color} p-2 rounded-lg shadow-sm`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-surface-900">{request.type}</p>
                      <p className="text-xs text-surface-700/50 mt-0.5">
                        {new Date(request.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {request.currentAuthorityId?.name && <span> · With <span className="font-medium text-surface-700">{request.currentAuthorityId.name}</span></span>}
                      </p>
                    </div>
                  </div>
                  <Badge status={request.status} />
                </div>
                {request.slaDeadline && <SlaBar createdAt={request.createdAt} slaDeadline={request.slaDeadline} />}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed z-50 inset-0 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-surface-900/50 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-surface-900">Create New Request</h3>
                <p className="text-xs text-surface-700/60 mt-0.5">AI will format your reason into formal language</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-surface-900 mb-1.5">Request Type</label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                >
                  <option value="Attendance Correction">Attendance Correction</option>
                  <option value="Event Participation">Event Participation</option>
                  <option value="Medical Leave Intimation">Medical Leave (Phase 1 — Intimation)</option>
                  <option value="Bonafide Certificate">Bonafide Certificate</option>
                </select>
              </div>

              {requestType === 'Medical Leave Intimation' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-surface-900 mb-1.5">From Date</label>
                    <input type="date" required value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-surface-900 mb-1.5">To Date</label>
                    <input type="date" required value={toDate} onChange={e => setToDate(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-surface-900 mb-1.5">
                  Reason <span className="font-normal text-surface-700/50">(write casually, AI will format)</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={reasonRaw}
                  onChange={(e) => setReasonRaw(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 resize-none"
                  placeholder="e.g. I was sick yesterday with high fever and couldn't attend classes..."
                />
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Sparkles className="h-3 w-3 text-primary-400" />
                  <p className="text-[11px] text-primary-500 font-medium">Gemini AI will rewrite this into formal language</p>
                </div>
              </div>

              {requestType !== 'Medical Leave Intimation' && (
                <div>
                  <label className="block text-sm font-semibold text-surface-900 mb-1.5">Upload Proof <span className="font-normal text-surface-700/50">(optional)</span></label>
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-all">
                    <Upload className="h-5 w-5 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">{file ? file.name : 'Click to upload (JPG, PNG, PDF)'}</span>
                    <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                  </label>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-surface-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 bg-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:bg-primary-700 transition-all disabled:opacity-50 text-sm">
                  {submitting ? 'Submitting…' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
