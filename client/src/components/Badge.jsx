import { CheckCircle, Clock, AlertTriangle, XCircle, Sparkles } from 'lucide-react';

const config = {
  Approved:  { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle, dot: 'bg-emerald-500' },
  Verified:  { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle, dot: 'bg-emerald-500' },
  Pending:   { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   icon: Clock,       dot: 'bg-amber-500' },
  'Under Review':       { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    icon: Sparkles,    dot: 'bg-blue-500' },
  Acknowledged:         { bg: 'bg-sky-50',     text: 'text-sky-700',     border: 'border-sky-200',     icon: Clock,       dot: 'bg-sky-500' },
  'Documents Submitted':{ bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200',  icon: Clock,       dot: 'bg-violet-500' },
  Rejected:  { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     icon: XCircle,     dot: 'bg-red-500' },
  Escalated: { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200',  icon: AlertTriangle,dot: 'bg-orange-500' },
  Revoked:   { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     icon: XCircle,     dot: 'bg-red-500' },
};

const fallback = { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', icon: Clock, dot: 'bg-gray-400' };

export default function Badge({ status, size = 'sm' }) {
  const c = config[status] || fallback;
  const Icon = c.icon;
  const sizeClasses = size === 'lg' ? 'px-3 py-1 text-sm gap-1.5' : 'px-2 py-0.5 text-xs gap-1';

  return (
    <span className={`inline-flex items-center font-semibold rounded-full border ${c.bg} ${c.text} ${c.border} ${sizeClasses}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`}></span>
      {status}
    </span>
  );
}
