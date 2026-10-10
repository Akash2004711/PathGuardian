import React, { useEffect, useState } from 'react';
import { History, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { MediaUpload } from '../types';

export const JobsPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaUpload[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchJobs = () => {
    setLoading(true);
    api.listMedia()
      .then((res) => setMediaList(res.data))
      .catch((err) => console.error("Failed to load processing jobs", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-sans text-white flex items-center space-x-2">
            <History className="w-6 h-6 text-cyan-glow" />
            <span>Processing Job History</span>
          </h1>
          <p className="text-xs text-slate-400">Track video frame extraction, OpenCV preprocessing, and YOLO inference status.</p>
        </div>

        <button
          onClick={fetchJobs}
          className="px-4 py-2 rounded-xl glass-panel text-xs text-cyan-glow hover:border-cyan-500/40 flex items-center space-x-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-cyan-glow font-mono uppercase text-[11px] border-b border-white/10">
              <tr>
                <th className="p-4">Filename</th>
                <th className="p-4">Media Type</th>
                <th className="p-4">File Size</th>
                <th className="p-4">Status</th>
                <th className="p-4">Uploaded At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-mono">
                    Loading processing jobs...
                  </td>
                </tr>
              ) : mediaList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No processing jobs found. Upload media to start job queue.
                  </td>
                </tr>
              ) : (
                mediaList.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-white">{item.original_name}</td>
                    <td className="p-4 font-mono">{item.media_type}</td>
                    <td className="p-4 font-mono">{(item.file_size / 1024).toFixed(1)} KB</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                          item.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.status === 'PROCESSING'
                            ? 'bg-cyan-500/20 text-cyan-glow border border-cyan-500/30 animate-pulse'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {item.status === 'COMPLETED' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-400">
                      {new Date(item.uploaded_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
