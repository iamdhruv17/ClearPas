export default function SlaBar({ createdAt, slaDeadline }) {
  if (!slaDeadline || !createdAt) return null;

  const now = new Date();
  const created = new Date(createdAt);
  const deadline = new Date(slaDeadline);
  const total = deadline - created;
  const elapsed = now - created;
  const pct = Math.min(Math.max((elapsed / total) * 100, 0), 100);

  let barColor = 'bg-emerald-500';
  let label = 'On Track';
  if (pct >= 90) { barColor = 'bg-red-500'; label = 'Critical'; }
  else if (pct >= 50) { barColor = 'bg-amber-500'; label = 'Approaching'; }

  const remaining = Math.max(0, deadline - now);
  const hoursLeft = Math.floor(remaining / (1000 * 60 * 60));
  const minsLeft = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${pct >= 90 ? 'text-red-600' : pct >= 50 ? 'text-amber-600' : 'text-emerald-600'}`}>
          {label}
        </span>
        <span className="text-[10px] text-surface-700 font-medium">
          {pct >= 100 ? 'Breached' : `${hoursLeft}h ${minsLeft}m left`}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        ></div>
      </div>
    </div>
  );
}
