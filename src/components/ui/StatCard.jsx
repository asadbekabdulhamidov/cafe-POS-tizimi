import React from 'react';

export function StatCard({
  title,
  value,
  subvalue,
  icon: Icon,
  trend,
  color = 'emerald',
  className = '',
}) {
  const colorStyles = {
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-700 border-amber-100',
      iconBg: 'bg-amber-100 text-amber-700',
    },
    blue: {
      bg: 'bg-blue-50 text-blue-600 border-blue-100',
      iconBg: 'bg-blue-100 text-blue-700',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600 border-purple-100',
      iconBg: 'bg-purple-100 text-purple-700',
    },
    slate: {
      bg: 'bg-slate-50 text-slate-700 border-slate-200',
      iconBg: 'bg-slate-100 text-slate-700',
    },
  };

  const style = colorStyles[color] || colorStyles.emerald;

  return (
    <div className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <p className="text-2xl font-bold tracking-tight text-slate-900">{value}</p>
        {trend && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
            {trend}
          </span>
        )}
      </div>
      {subvalue && <p className="mt-1 text-xs text-slate-500">{subvalue}</p>}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) {
  return (
    <div className={`text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 ${className}`}>
      {Icon && (
        <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 mb-3.5">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">{description}</p>}
      {actionText && onAction && (
        <div className="mt-4">
          <button
            onClick={onAction}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
}
