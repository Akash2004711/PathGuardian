import React, { useEffect, useState } from 'react';
import { Activity, ShieldAlert, CheckCircle, ArrowUpRight } from 'lucide-react';
import { api } from '../services/api';
import { RoadSegment } from '../types';

export const RoadHealthPage: React.FC = () => {
  const [segments, setSegments] = useState<RoadSegment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.listRoadSegments()
      .then((res) => setSegments(res.data))
      .catch((err) => console.error("Failed to load road segments", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-sans text-white flex items-center space-x-2">
          <Activity className="w-6 h-6 text-amber-400" />
          <span>Road Health Intelligence Analytics</span>
        </h1>
        <p className="text-xs text-slate-400">
          Composite road condition indices (0 to 100), pothole density calculations, and maintenance priority scoring.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-500 font-mono">
            Calculating road segment health metrics...
          </div>
        ) : (
          segments.map((seg) => {
            const healthColor = seg.health_score > 75 ? 'text-emerald-400' : seg.health_score > 50 ? 'text-amber-400' : 'text-rose-400';
            const barBg = seg.health_score > 75 ? 'bg-emerald-400' : seg.health_score > 50 ? 'bg-amber-400' : 'bg-rose-500';

            return (
              <div key={seg.id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyan-glow bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                    {seg.code}
                  </span>
                  <span className={`text-xl font-bold font-mono ${healthColor}`}>
                    {seg.health_score.toFixed(1)} / 100
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{seg.name}</h3>

                {/* Health Bar Meter */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Condition Index</span>
                    <span>{seg.health_score.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div className={`h-full ${barBg} transition-all duration-500`} style={{ width: `${seg.health_score}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10 text-slate-300">
                  <div>
                    <span className="text-slate-500 text-[10px] block">SEGMENT LENGTH</span>
                    <span className="font-mono font-bold">{seg.length_km} km</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">TOTAL HAZARDS</span>
                    <span className="font-mono font-bold text-amber-400">{seg.total_potholes} Detections</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
