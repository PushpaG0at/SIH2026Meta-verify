import React from 'react';
import { Filter } from 'lucide-react';

export const FilterDropdown = ({
  options = [],
  value,
  onChange,
  label = 'Filter',
  className = ''
}) => {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <div className="absolute left-3 pointer-events-none text-slate-400">
        <Filter className="w-3.5 h-3.5" />
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8.5 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 shadow-xs appearance-none cursor-pointer"
      >
        <option value="">{label}: All</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 pointer-events-none text-slate-400 text-xs">
        ▼
      </div>
    </div>
  );
};

export default FilterDropdown;
