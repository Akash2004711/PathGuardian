import React, { useState } from 'react';
import { Settings, Cpu, Sliders, CheckCircle2 } from 'lucide-react';

export const ModelConfigPage: React.FC = () => {
  const [confidence, setConfidence] = useState<number>(0.25);
  const [modelWeights, setModelWeights] = useState<string>('yolov8n-pothole.pt');
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-sans text-white flex items-center space-x-2">
          <Settings className="w-6 h-6 text-cyan-glow" />
          <span>YOLO Model Configuration & Inference Settings</span>
        </h1>
        <p className="text-xs text-slate-400">Configure Ultralytics YOLOv8 weights, confidence thresholds, and demonstration modes.</p>
      </div>

      <form onSubmit={handleSave} className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">
            Confidence Threshold: <span className="font-mono text-cyan-glow font-bold">{(confidence * 100).toFixed(0)}%</span>
          </label>
          <input
            type="range"
            min="0.05"
            max="0.95"
            step="0.05"
            value={confidence}
            onChange={(e) => setConfidence(parseFloat(e.target.value))}
            className="w-full h-2 rounded-lg bg-slate-900 accent-cyan-400 cursor-pointer"
          />
          <p className="text-[11px] text-slate-500">Minimum detection confidence score filter applied during inference.</p>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">Model Weights File</label>
          <select
            value={modelWeights}
            onChange={(e) => setModelWeights(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
          >
            <option value="yolov8n-pothole.pt">YOLOv8 Nano (yolov8n-pothole.pt - Fast CPU)</option>
            <option value="yolov8s-pothole.pt">YOLOv8 Small (yolov8s-pothole.pt - High Precision)</option>
            <option value="yolov8m-pothole.pt">YOLOv8 Medium (yolov8m-pothole.pt - Production)</option>
          </select>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <input
            type="checkbox"
            id="demo-toggle"
            checked={demoMode}
            onChange={(e) => setDemoMode(e.target.checked)}
            className="w-4 h-4 rounded bg-slate-900 border-white/10 text-cyan-500 focus:ring-cyan-500"
          />
          <label htmlFor="demo-toggle" className="text-xs text-slate-300 cursor-pointer">
            Enable Fallback Demonstration Mode (Provides sample detections if custom weights file is unmounted)
          </label>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 flex items-center space-x-2"
        >
          <span>Save Model Configuration</span>
        </button>

        {saved && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Model settings saved successfully!</span>
          </div>
        )}
      </form>
    </div>
  );
};
