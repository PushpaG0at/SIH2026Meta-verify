import React from 'react';

export const Table = ({ children, className = '', ...props }) => (
  <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
    <table className={`w-full caption-bottom text-xs sm:text-sm text-left ${className}`} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children, className = '', ...props }) => (
  <thead className={`bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px] tracking-wider ${className}`} {...props}>
    {children}
  </thead>
);

export const TableBody = ({ children, className = '', ...props }) => (
  <tbody className={`divide-y divide-slate-100 bg-white ${className}`} {...props}>
    {children}
  </tbody>
);

export const TableFooter = ({ children, className = '', ...props }) => (
  <tfoot className={`bg-slate-50 font-medium text-slate-600 border-t border-slate-200 ${className}`} {...props}>
    {children}
  </tfoot>
);

export const TableRow = ({ children, className = '', hover = true, ...props }) => (
  <tr
    className={`transition-colors ${
      hover ? 'hover:bg-slate-50/70' : ''
    } ${className}`}
    {...props}
  >
    {children}
  </tr>
);

export const TableHead = ({ children, className = '', ...props }) => (
  <th
    className={`h-10 px-4 py-2.5 text-left align-middle font-semibold text-slate-600 ${className}`}
    {...props}
  >
    {children}
  </th>
);

export const TableCell = ({ children, className = '', ...props }) => (
  <td
    className={`px-4 py-3 align-middle text-slate-800 ${className}`}
    {...props}
  >
    {children}
  </td>
);

export const TableCaption = ({ children, className = '', ...props }) => (
  <caption className={`mt-4 text-xs text-slate-500 italic ${className}`} {...props}>
    {children}
  </caption>
);

export default Table;
