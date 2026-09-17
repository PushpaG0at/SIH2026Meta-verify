import React from 'react';
import { Camera, MapPin, Clock, FileCheck2 } from 'lucide-react';

export const EvidenceCard = ({
  evidence = {},
  inspectorName = 'Vikram Singh',
  timestamp = '2026-09-05 14:45 IST',
  gpsCoordinates = '28.6139° N, 77.2090° E',
  photos = [
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500&auto=format&fit=crop&q=60'
  ],
  measurements = [],
  remarks = ''
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Physical Inspection Evidence</h4>
            <p className="text-xs text-slate-500">Audited field telematics & digital capture</p>
          </div>
        </div>
        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <FileCheck2 className="w-3.5 h-3.5" /> Verified on Site
        </span>
      </div>

      {/* Geolocation & Telematics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">GPS Geofence</span>
            <span className="font-mono text-slate-800">{gpsCoordinates}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="w-4 h-4 text-blue-500 shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Audit Timestamp</span>
            <span className="text-slate-800 font-medium">{timestamp}</span>
          </div>
        </div>
      </div>

      {/* Evidence Photos */}
      {photos && photos.length > 0 && (
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Inspection Photos & Markings
          </h5>
          <div className="grid grid-cols-2 gap-3">
            {photos.map((url, i) => (
              <div
                key={i}
                className="group relative rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-100"
              >
                <img
                  src={url}
                  alt={`Evidence capture ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[11px] text-white font-medium">
                    {i === 0 ? 'Device Serial Plate & Markings' : 'Full Device Setup'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Measurements Table */}
      {measurements && measurements.length > 0 && (
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Calibration Test Weights & Errors
          </h5>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold">
                <tr>
                  <th className="px-3 py-2">Test Standard</th>
                  <th className="px-3 py-2">Observed Reading</th>
                  <th className="px-3 py-2">Error</th>
                  <th className="px-3 py-2">Permissible (MPE)</th>
                  <th className="px-3 py-2 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {measurements.map((m, idx) => (
                  <tr key={idx}>
                    <td className="px-3 py-2 font-medium text-slate-800">{m.testWeight}</td>
                    <td className="px-3 py-2 font-mono text-slate-700">{m.reading}</td>
                    <td className="px-3 py-2 font-mono text-slate-700">{m.error}</td>
                    <td className="px-3 py-2 text-slate-500">{m.tolerance}</td>
                    <td className="px-3 py-2 text-right font-bold text-emerald-700">{m.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Remarks */}
      {remarks && (
        <div className="text-xs p-3 bg-slate-50 rounded-lg border border-slate-200">
          <p className="font-semibold text-slate-700 mb-0.5">Inspector Remarks:</p>
          <p className="text-slate-600 italic">"{remarks}"</p>
        </div>
      )}
    </div>
  );
};

export default EvidenceCard;
