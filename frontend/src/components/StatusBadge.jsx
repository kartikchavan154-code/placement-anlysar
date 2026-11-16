import React from 'react';

export const StatusBadge = ({ status }) => {
  const configs = {
    APPLIED: {
      label: 'Applied',
      className: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    UNDER_REVIEW: {
      label: 'Under Review',
      className: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    SHORTLISTED: {
      label: 'Shortlisted',
      className: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    TECHNICAL_ROUND: {
      label: 'Technical Round',
      className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    HR_ROUND: {
      label: 'HR Round',
      className: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    },
    SELECTED: {
      label: 'Selected / Placed',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold',
    },
    REJECTED: {
      label: 'Not Selected',
      className: 'bg-rose-50 text-rose-700 border-rose-200',
    },
  };

  const current = configs[status] || {
    label: status || 'Pending',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${current.className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
      {current.label}
    </span>
  );
};

