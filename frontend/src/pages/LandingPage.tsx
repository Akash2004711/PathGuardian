import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Cpu, MapPin, Eye, Wrench, ArrowRight, Activity, CheckCircle2 } from 'lucide-react';
import { Road3DScene } from '../three/Road3DScene';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl p-8 lg:p-12 glass-panel border border-cyan-500/30 overflow-hidden shadow-2xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-glow text-xs font-mono font-semibold">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Next-Gen Geospatial Road Monitoring</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold font-sans tracking-tight leading-tight text-white">
              AI-Powered <span className="bg-gradient-to-r from-cyan-glow via-cyan-400 to-blue-500 bg-clip-text text-transparent">Pothole Detection</span> & Road Health Platform
            </h1>

            <p className="text-slate-300 text-sm lg:text-base leading-relaxed">
              PathGuardian combines computer vision (YOLOv8), EasyOCR telemetry extraction, spatial GPX matching, and 3D geospatial rendering to transform municipal road maintenance.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/dashboard"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 hover:brightness-110 transition-all flex items-center space-x-2"
              >
                <span>Launch Live Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/upload"
                className="px-6 py-3.5 rounded-xl glass-panel text-slate-200 font-semibold text-sm hover:border-cyan-500/50 hover:text-cyan-glow transition-all flex items-center space-x-2"
              >
                <Cpu className="w-4 h-4 text-cyan-glow" />
                <span>Upload Media & Run AI</span>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div>
                <p className="text-2xl font-bold font-mono text-cyan-glow">98.4%</p>
                <p className="text-xs text-slate-400">Detection Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-emerald-400">&lt; 150ms</p>
                <p className="text-xs text-slate-400">YOLOv8 Inference</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-amber-400">0 - 100</p>
                <p className="text-xs text-slate-400">Health Index</p>
              </div>
            </div>
          </div>

          {/* Interactive 3D Canvas Scene */}
          <div className="w-full h-[450px]">
            <Road3DScene />
          </div>
        </div>
      </div>

      {/* Feature Architecture Grid */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white font-sans">End-to-End Road Intelligence Pipeline</h2>
          <p className="text-slate-400 text-xs">Autonomous capture, computer vision, geospatial mapping, and repair tracking.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-glow">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">YOLOv8 AI Detection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated image & video frame processing detecting road hazards with high-precision bounding boxes.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">GPS / GPX Telemetry</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Timestamp matching interpolates bounding box frame detections with GPX track data for exact map pinning.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Road Health Index</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Algorithmic road segment scoring (0-100) evaluating density, severity, and historical repair progression.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Maintenance Workflow</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full lifecycle tracking from verification to work order dispatch, repair proof, and authority sign-off.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
