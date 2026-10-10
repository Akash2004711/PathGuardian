import React from 'react';
import { HelpCircle, BookOpen, Terminal, Code, Cpu } from 'lucide-react';

export const DocsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-sans text-white flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-cyan-glow" />
          <span>PathGuardian Platform Documentation</span>
        </h1>
        <p className="text-xs text-slate-400">Architecture reference, CLI setup guide, YOLO model training workflow, and troubleshooting.</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 text-xs text-slate-300">
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-cyan-glow" />
            <span>Local Development Commands (Windows PowerShell)</span>
          </h2>
          <div className="p-4 rounded-xl bg-slate-900 font-mono text-[11px] text-cyan-300 space-y-1">
            <p># 1. Start FastAPI Backend Server</p>
            <p className="text-slate-200">cd backend; .venv\Scripts\uvicorn app.main:app --reload --port 8000</p>
            <br />
            <p># 2. Start Vite React Frontend Server</p>
            <p className="text-slate-200">cd frontend; npm run dev</p>
            <br />
            <p># 3. Seed Database with Demo Accounts & Hazards</p>
            <p className="text-slate-200">backend\.venv\Scripts\python scripts/seed_db.py</p>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-white/10">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>YOLOv8 Model Training Guide</span>
          </h2>
          <p>
            PathGuardian supports custom YOLOv8 detection weights trained on pothole dataset annotations (Roboflow / KITTI format).
            Run <code className="text-cyan-glow font-mono bg-slate-900 px-1 py-0.5 rounded">python ml/train.py</code> to train on local GPU or CPU.
          </p>
        </div>
      </div>
    </div>
  );
};
