import React from 'react';

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 ${className}`}
    >
      {Icon && (
        <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 mb-3.5">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">{description}</p>
      )}
      {actionText && onAction && (
        <div className="mt-4">
          <button
            type="button"
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
