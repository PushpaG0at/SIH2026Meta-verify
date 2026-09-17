import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  iconColor = 'text-blue-600 bg-blue-50',
  className = ''
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition-shadow duration-200 ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </p>
        {Icon && (
          <div className={`p-2.5 rounded-lg shrink-0 ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
          {value}
        </h3>
        {trend && (
          <span
            className={`text-xs font-medium px-1.5 py-0.5 rounded ${
              trendPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;
