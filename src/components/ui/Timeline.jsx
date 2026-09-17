import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const Timeline = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {items.map((event, eventIdx) => (
          <li key={eventIdx}>
            <div className="relative pb-8">
              {eventIdx !== items.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                      event.status === 'completed'
                        ? 'bg-emerald-500 text-white'
                        : event.status === 'current'
                        ? 'bg-blue-500 text-white'
                        : event.status === 'failed'
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {event.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : event.status === 'failed' ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{event.title}</p>
                    {event.description && (
                      <p className="mt-0.5 text-xs text-slate-500">{event.description}</p>
                    )}
                    {event.actor && (
                      <p className="mt-0.5 text-[11px] text-slate-400">By: {event.actor}</p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-xs text-slate-400">
                    <time>{event.date}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;
