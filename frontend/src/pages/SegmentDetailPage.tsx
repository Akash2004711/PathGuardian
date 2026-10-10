import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Activity, ArrowLeft, MapPin } from 'lucide-react';

export const SegmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link to="/road-health" className="inline-flex items-center space-x-2 text-xs text-cyan-glow hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Road Health Analytics</span>
      </Link>

      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h1 className="text-xl font-bold font-sans text-white">Road Segment Details [{id || 'HWY-A1-N'}]</h1>
        <p className="text-xs text-slate-400">Detailed inspection history, pothole density map, and maintenance logs.</p>
        
        <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/20 text-xs font-mono text-cyan-glow">
          Segment ID: {id} • Status: Active Monitoring • Health Index: 78.5 / 100
        </div>
      </div>
    </div>
  );
};
