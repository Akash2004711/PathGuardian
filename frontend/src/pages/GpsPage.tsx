import React, { useState } from 'react';
import { Navigation, UploadCloud, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

export const GpsPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.uploadGPXTrack(formData);
      setMessage('GPX track uploaded and interpolated successfully!');
    } catch (err: any) {
      setMessage(`Upload error: ${err.response?.data?.detail || 'Failed to process GPX file'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold font-sans text-white flex items-center justify-center space-x-2">
          <Navigation className="w-6 h-6 text-cyan-glow" />
          <span>GPS & GPX Telemetry Integration</span>
        </h1>
        <p className="text-xs text-slate-400">
          Upload GPX tracks or CSV GPS logs to interpolate detection timestamps with latitude and longitude.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Upload .gpx Track or .csv Telemetry File
            </label>
            <input
              type="file"
              accept=".gpx,.csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-white file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-cyan-500/20 file:text-cyan-glow file:font-semibold"
            />
          </div>

          <button
            type="submit"
            disabled={!file || uploading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 disabled:opacity-50"
          >
            {uploading ? 'Processing Telemetry...' : 'Parse & Match GPX Track'}
          </button>
        </form>

        {message && (
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-glow text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
};
