import React from 'react';
import EmptyState from './EmptyState';
import LoadingState from './LoadingState';

export const DataTable = ({
  columns = [],
  data = [],
  keyField = 'id',
  isLoading = false,
  emptyTitle = 'No data available',
  emptyDescription = 'No records match the current view criteria.',
  onRowClick,
  renderMobileCard
}) => {
  if (isLoading) {
    return <LoadingState message="Fetching table records..." />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="w-full">
      {/* Mobile Card View (hidden on sm/md and above) */}
      <div className="block md:hidden space-y-3">
        {data.map((item, idx) => (
          <div
            key={item[keyField] || idx}
            onClick={() => onRowClick && onRowClick(item)}
            className={`bg-white p-4 rounded-xl border border-slate-200 shadow-xs ${
              onRowClick ? 'cursor-pointer active:bg-slate-50' : ''
            }`}
          >
            {renderMobileCard ? (
              renderMobileCard(item)
            ) : (
              <div className="space-y-2">
                {columns.map((col, cIdx) => (
                  <div key={cIdx} className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">{col.header}</span>
                    <span className="text-slate-900 font-semibold">
                      {col.render ? col.render(item) : item[col.accessor]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Table View (hidden on small mobile screens) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 ${
                    col.className || ''
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((row, rIdx) => (
              <tr
                key={row[keyField] || rIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors ${
                  onRowClick
                    ? 'cursor-pointer hover:bg-slate-50/80 active:bg-slate-100'
                    : 'hover:bg-slate-50/50'
                }`}
              >
                {columns.map((col, cIdx) => (
                  <td
                    key={cIdx}
                    className={`px-4 py-3.5 whitespace-nowrap text-slate-700 ${
                      col.cellClassName || ''
                    }`}
                  >
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
