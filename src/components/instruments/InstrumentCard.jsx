import React from 'react';
import { Scale, MapPin, Calendar, Award, ChevronRight } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import { Link } from 'react-router-dom';

export const InstrumentCard = ({ instrument }) => {
  if (!instrument) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[11px] font-bold text-blue-600 tracking-wider">
                {instrument.id}
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
                {instrument.instrumentType}
              </h4>
            </div>
          </div>
          <StatusBadge status={instrument.status} size="sm" />
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Make & Model:</span>
            <span className="font-medium text-slate-800 text-right">{instrument.manufacturer} ({instrument.model})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Serial Number:</span>
            <span className="font-mono font-semibold text-slate-800">{instrument.serialNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Capacity & Class:</span>
            <span className="font-medium text-slate-800">{instrument.capacity} • {instrument.accuracyClass}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 pt-1 truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{instrument.location}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>Purchased: {instrument.purchaseDate}</span>
        </div>
        <Link
          to={`/business/instruments/${instrument.id}`}
          className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Details
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default InstrumentCard;
