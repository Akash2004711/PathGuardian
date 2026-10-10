import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { PotholeDetection } from '../types';

export const AuthorityPage: React.FC = () => {
  const [unverified, setUnverified] = useState<PotholeDetection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUnverified = () => {
    setLoading(true);
    api.listDetections({ status: 'UNVERIFIED' })
      .then((res) => setUnverified(res.data))
      .catch((err) => console.error("Failed to load unverified hazards", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUnverified();
  }, []);

  const handleVerify = async (id: string, isVerified: boolean) => {
    try {
      await api.updateDetection(id, { status: isVerified ? 'VERIFIED' : 'REJECTED' });
      fetchUnverified();
    } catch (err) {
      console.error("Failed to update detection", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-sans text-white flex items-center space-x-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <span>Government Authority Verification Portal</span>
        </h1>
        <p className="text-xs text-slate-400">Review AI-detected pothole hazards before dispatching municipal maintenance crews.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-500 font-mono">
            Loading unverified hazard Queue...
          </div>
        ) : unverified.length === 0 ? (
          <div className="col-span-full p-8 glass-panel rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-white">All Detections Verified</p>
            <p className="text-xs text-slate-400">There are no pending unverified detections requiring authority review.</p>
          </div>
        ) : (
          unverified.map((det) => (
            <div key={det.id} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">{det.severity} SEVERITY</span>
                <span className="text-xs font-mono text-cyan-glow">{(det.confidence * 100).toFixed(0)}% AI Conf</span>
              </div>
              <p className="text-xs text-slate-300">{det.notes || 'Pothole detection awaiting official authority verification.'}</p>
              
              <div className="flex items-center space-x-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => handleVerify(det.id, true)}
                  className="flex-1 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 flex items-center justify-center space-x-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify</span>
                </button>
                <button
                  onClick={() => handleVerify(det.id, false)}
                  className="flex-1 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/30 flex items-center justify-center space-x-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
