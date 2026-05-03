import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowRight, FileText, Activity, Sparkles, Clock, User, ExternalLink } from 'lucide-react';
import api from '../services/api';
import Badge from '../components/Badge';
import SlaBar from '../components/SlaBar';

export default function AuthorityDashboard({ user }) {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [remark, setRemark] = useState('');
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests');
      setRequests(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAction = async (action) => {
    if (!selectedRequest) return;
    setProcessing(true);
    try {
      await api.put(`/requests/${selectedRequest._id}/action`, { action, remark });
      setSelectedRequest(null);
      setRemark('');
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert('Error updating request');
    } finally { setProcessing(false); }
  };

  const filteredRequests = filter === 'all' ? requests : requests.filter(r => r.status === filter);
  const pendingCount = requests.filter(r => r.status === 'Pending').length;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-surface-900">Approval Queue</h1>
        <p className="text-sm text-surface-700/60 mt-1">
          {pendingCount > 0 ? `${pendingCount} request${pendingCount > 1 ? 's' : ''} awaiting your action` : 'All caught up!'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {['all', 'Pending', 'Under Review', 'Approved', 'Rejected'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${
              filter === f 
                ? 'bg-primary-600 text-white border-primary-600 shadow-sm' 
                : 'bg-white text-surface-700 border-gray-200 hover:border-primary-300'
            }`}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      <div className="flex h-[calc(100vh-14rem)] gap-5">
        {/* Left List */}
        <div className="w-2/5 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-surface-700/60 uppercase tracking-wider">
              {filteredRequests.length} Request{filteredRequests.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <Clock className="h-10 w-10 text-gray-300 mb-3" />
                <p className="text-sm font-medium text-surface-700">No requests</p>
              </div>
            ) : (
              filteredRequests.map(req => (
                <div
                  key={req._id}
                  onClick={() => setSelectedRequest(req)}
                  className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                    selectedRequest?._id === req._id 
                      ? 'border-primary-400 bg-primary-50/60 shadow-sm' 
                      : 'border-gray-100 hover:border-primary-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-1 rounded-full flex-shrink-0">
                        <User className="h-3 w-3 text-white" />
                      </div>
                      <span className="font-semibold text-sm text-surface-900 truncate">{req.studentId?.name}</span>
                    </div>
                    <Badge status={req.status} />
                  </div>
                  <p className="text-xs text-surface-700/60 ml-7">{req.type}</p>
                  <div className="ml-7">
                    <SlaBar createdAt={req.createdAt} slaDeadline={req.slaDeadline} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Detail */}
        <div className="w-3/5 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          {selectedRequest ? (
            <div className="flex flex-col h-full">
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-surface-900">{selectedRequest.studentId?.name}</h2>
                    <p className="text-sm text-surface-700/60">Class: {selectedRequest.studentId?.classId} · {selectedRequest.studentId?.email}</p>
                  </div>
                  <Badge status={selectedRequest.status} size="lg" />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-surface-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-semibold text-surface-700/50 uppercase tracking-wider">Type</p>
                    <p className="text-sm font-bold text-surface-900 mt-1">{selectedRequest.type}</p>
                  </div>
                  <div className="bg-surface-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-semibold text-surface-700/50 uppercase tracking-wider">Submitted</p>
                    <p className="text-sm font-bold text-surface-900 mt-1">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {/* SLA Bar for detail view */}
                {selectedRequest.slaDeadline && (
                  <div className="mb-6 bg-surface-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-semibold text-surface-700/50 uppercase tracking-wider mb-2">SLA Progress</p>
                    <SlaBar createdAt={selectedRequest.createdAt} slaDeadline={selectedRequest.slaDeadline} />
                  </div>
                )}

                {/* Formal Reason */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary-500" />
                    <h3 className="text-sm font-bold text-surface-900">Formal Reason (AI Rewritten)</h3>
                  </div>
                  <div className="bg-primary-50/50 border border-primary-100 rounded-xl p-4 text-sm text-surface-800 leading-relaxed">
                    {selectedRequest.reasonFormal || selectedRequest.reasonRaw}
                  </div>
                  {selectedRequest.reasonFormal && selectedRequest.reasonRaw !== selectedRequest.reasonFormal && (
                    <details className="mt-2">
                      <summary className="text-xs text-surface-700/50 cursor-pointer hover:text-surface-700">View original text</summary>
                      <p className="text-xs text-surface-700/60 mt-1 bg-gray-50 p-3 rounded-lg italic">{selectedRequest.reasonRaw}</p>
                    </details>
                  )}
                </div>

                {/* Documents */}
                {selectedRequest.documents?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-surface-900 mb-3">Attached Documents</h3>
                    {selectedRequest.documents.map((doc, idx) => (
                      <div key={idx} className="border border-gray-100 rounded-xl p-4 bg-surface-50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" /> Document {idx + 1}
                          </span>
                          {doc.aiVerdict && (
                            <span className={`px-2.5 py-1 text-xs rounded-full font-bold border ${
                              doc.aiVerdict === 'Likely Valid' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              AI: {doc.aiVerdict}
                            </span>
                          )}
                        </div>
                        <a href={`http://localhost:5000${doc.fileUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 text-sm font-medium">
                          <ExternalLink className="h-3.5 w-3.5" /> View File
                        </a>
                        {doc.extractedText && (
                          <div className="mt-3 text-xs text-surface-700/70 border-t border-gray-200 pt-3">
                            <p className="font-semibold text-surface-900 mb-1">AI Extraction:</p>
                            <pre className="whitespace-pre-wrap font-sans bg-white p-2 rounded-lg border border-gray-100">{doc.extractedText}</pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Audit Log */}
                {selectedRequest.logs?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-surface-900 mb-3">Activity Log</h3>
                    <div className="space-y-2">
                      {selectedRequest.logs.map((log, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 flex-shrink-0"></div>
                          <div>
                            <p className="font-semibold text-surface-900">{log.action}</p>
                            {log.note && <p className="text-surface-700/60">{log.note}</p>}
                            <p className="text-surface-700/40 mt-0.5">{new Date(log.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="p-4 border-t border-gray-100 bg-surface-50">
                <textarea
                  rows={2}
                  value={remark}
                  onChange={e => setRemark(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 focus:outline-none mb-3 resize-none"
                  placeholder="Add a remark (optional)..."
                />
                <div className="flex gap-2">
                  <button onClick={() => handleAction('Approve')} disabled={processing} className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all disabled:opacity-50">
                    <CheckCircle className="h-4 w-4" /> Approve
                  </button>
                  <button onClick={() => handleAction('Reject')} disabled={processing} className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-all disabled:opacity-50">
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                  <button onClick={() => handleAction('Forward')} disabled={processing} className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-surface-700 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-all disabled:opacity-50">
                    <ArrowRight className="h-4 w-4" /> Forward
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="bg-surface-100 p-5 rounded-2xl mb-4">
                <Activity className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-base font-bold text-surface-900">No Request Selected</h3>
              <p className="text-sm text-surface-700/50 mt-1 max-w-xs">Select a request from the queue on the left to view details and take action.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
