import React, { useEffect, useState } from 'react';
import { Eye, ShieldCheck, AlertTriangle, CheckCircle2, XCircle, MapPin, Tag, SlidersHorizontal } from 'lucide-react';
import { api } from '../services/api';
import { PotholeDetection, DetectionStatus, SeverityLevel } from '../types';

export const ResultsPage: React.FC = () => {
  const [detections, setDetections] = useState<PotholeDetection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchDetections = () => {
    setLoading(true);
    api.listDetections()
      .then((res) => setDetections(res.data))
      .catch((err) => console.error("Failed to load detections", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetections();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: DetectionStatus) => {
    try {
      await api.updateDetection(id, { status: newStatus });
      fetchDetections();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const filtered = detections.filter((d) => {
    if (statusFilter === 'ALL') return true;
    return d.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans text-white flex items-center space-x-2">
            <Eye className="w-6 h-6 text-cyan-glow" />
            <span>AI Pothole Detection Results</span>
          </h1>
          <p className="text-xs text-slate-400">
            Bounding boxes, confidence scores, OCR extracted timestamps, and verification workflows.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="UNVERIFIED">Unverified</option>
            <option value="VERIFIED">Verified</option>
            <option value="IN_MAINTENANCE">In Maintenance</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs font-mono">
          Loading AI detections from database...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 glass-panel rounded-2xl text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <p className="text-sm font-bold text-white">No Detections Found</p>
          <p className="text-xs text-slate-400">Upload road media or adjust search filters to view hazards.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((det) => {
            const isCritical = det.severity === 'CRITICAL' || det.severity === 'HIGH';
            return (
              <div
                key={det.id}
                className="glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/40 transition-all space-y-4 p-5"
              >
                {/* Header Badges */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                      det.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : det.severity === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}
                  >
                    {det.severity} SEVERITY
                  </span>

                  <span className="text-xs font-mono font-bold text-cyan-glow">
                    {(det.confidence * 100).toFixed(1)}% Conf
                  </span>
                </div>

                {/* Annotation Geometry Preview Box */}
                <div className="h-40 rounded-xl bg-slate-900/90 border border-cyan-500/20 relative flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-cyber-grid opacity-30" />
                  <div className="relative text-center space-y-1">
                    <p className="text-xs font-mono text-cyan-glow font-bold">Bounding Box Overlay</p>
                    <p className="text-[10px] font-mono text-slate-400">
                      [{det.bbox.x}, {det.bbox.y}, {det.bbox.w}, {det.bbox.h}]
                    </p>
                    {det.ocr_timestamp && (
                      <p className="text-[10px] font-mono text-amber-400">
                        OCR: {det.ocr_timestamp}
                      </p>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs">
                  {det.latitude && det.longitude ? (
                    <div className="flex items-center space-x-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-cyan-glow flex-shrink-0" />
                      <span className="font-mono">{det.latitude.toFixed(4)}, {det.longitude.toFixed(4)}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>GPS Telemetry Pending</span>
                    </div>
                  )}

                  <p className="text-slate-400 line-clamp-2">{det.notes || 'AI detected road surface discontinuity.'}</p>
                </div>

                {/* Status Action Buttons */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">{det.status}</span>

                  <div className="flex items-center space-x-1">
                    {det.status !== 'VERIFIED' && (
                      <button
                        onClick={() => handleUpdateStatus(det.id, 'VERIFIED')}
                        className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        title="Verify Detection"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                    {det.status !== 'REJECTED' && (
                      <button
                        onClick={() => handleUpdateStatus(det.id, 'REJECTED')}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                        title="Reject Detection"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
