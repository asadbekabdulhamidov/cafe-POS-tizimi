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
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/40',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800/40',
      iconBg: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/40',
      iconBg: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800/40',
      iconBg: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
    },
    slate: {
      bg: 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      iconBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    },
  };

  const style = colorStyles[color] || colorStyles.emerald;

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 line-clamp-1">{title}</span>
        {Icon && (
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${style.iconBg}`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </div>
      <div className="mt-2 sm:mt-3 flex items-baseline justify-between">
        <p className="text-base sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 truncate">{value}</p>
        {trend && (
          <span className="text-[10px] sm:text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
            {trend}
          </span>
        )}
      </div>
      {subvalue && <p className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{subvalue}</p>}
    </div>
  );
}
