import React from 'react';
import { Settings, Mail, Map, Server } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-sans text-white flex items-center space-x-2">
          <Settings className="w-6 h-6 text-cyan-glow" />
          <span>System Settings & Environment</span>
        </h1>
        <p className="text-xs text-slate-400">Configure SMTP email notifications, map tile providers, and CORS endpoints.</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Mail className="w-4 h-4 text-cyan-glow" />
            <span>SMTP Email Configuration</span>
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <input
              type="text"
              placeholder="SMTP Host (e.g. smtp.gmail.com)"
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white"
            />
            <input
              type="number"
              placeholder="SMTP Port (587)"
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Map className="w-4 h-4 text-emerald-400" />
            <span>Map Tile Provider</span>
          </h3>
          <select className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs">
            <option value="osm">OpenStreetMap (Default - Free & Open Source)</option>
            <option value="gmaps">Google Maps Provider (Requires API Key)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
