import React, { useState } from 'react';
import { Box, Layers, Eye, Cpu, Activity, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { Road3DScene } from '../three/Road3DScene';

export const Intelligence3DPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'HEATMAP' | 'INSPECTION'>('TELEMETRY');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans text-white flex items-center space-x-2">
            <Box className="w-6 h-6 text-cyan-glow animate-pulse" />
            <span>3D Operations Intelligence Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time Three.js / React Three Fiber procedural road surface simulation with live hazard telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-2 p-1 rounded-xl bg-slate-900 border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('TELEMETRY')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'TELEMETRY' ? 'bg-cyan-500/20 text-cyan-glow border border-cyan-500/40' : 'text-slate-400'}`}
          >
            3D Telemetry
          </button>
          <button
            onClick={() => setActiveTab('HEATMAP')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'HEATMAP' ? 'bg-cyan-500/20 text-cyan-glow border border-cyan-500/40' : 'text-slate-400'}`}
          >
            Surface Mesh
          </button>
          <button
            onClick={() => setActiveTab('INSPECTION')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'INSPECTION' ? 'bg-cyan-500/20 text-cyan-glow border border-cyan-500/40' : 'text-slate-400'}`}
          >
            Inspection Beam
          </button>
        </div>
      </div>

      {/* 3D Canvas Scene Container */}
      <div className="h-[520px] w-full">
        <Road3DScene />
      </div>

      {/* Control Cards & Telemetry Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-cyan-glow">
            <span className="text-xs font-mono uppercase font-bold">Scanning Beam Status</span>
            <Cpu className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">ACTIVE (30 FPS)</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Lasers scan surface geometry at 5Hz sampling rate for volumetric depth differential analysis.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-mono uppercase font-bold">Surface Roughness</span>
            <Activity className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">IRI 3.8 m/km</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            International Roughness Index calculated from point cloud density across monitored lane bounds.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-mono uppercase font-bold">Active 3D Markers</span>
            <AlertOctagon className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold font-mono text-rose-400">3 Hazards Plotted</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Geolocated 3D hazard pins rendering in WebGL space synced with PostGIS coordinates.
          </p>
        </div>
      </div>
    </div>
  );
};
