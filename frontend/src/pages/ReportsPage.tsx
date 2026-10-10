import React from 'react';
import { FileSpreadsheet, Download, FileText, Code } from 'lucide-react';
import { api } from '../services/api';

export const ReportsPage: React.FC = () => {
  const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  };

  const handleDownloadCSV = async () => {
    try {
      const res = await api.exportReportCSV();
      downloadFile(new Blob([res.data]), 'pathguardian_potholes_report.csv');
    } catch (err) {
      console.error("CSV Export Error", err);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const res = await api.exportReportPDF();
      downloadFile(new Blob([res.data], { type: 'application/pdf' }), 'pathguardian_summary_report.pdf');
    } catch (err) {
      console.error("PDF Export Error", err);
    }
  };

  const handleDownloadJSON = async () => {
    try {
      const res = await api.exportReportJSON();
      const jsonBlob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      downloadFile(jsonBlob, 'pathguardian_export.json');
    } catch (err) {
      console.error("JSON Export Error", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-sans text-white flex items-center space-x-2">
          <FileSpreadsheet className="w-6 h-6 text-cyan-glow" />
          <span>Reports & Data Export Engine</span>
        </h1>
        <p className="text-xs text-slate-400">Download automated CSV, PDF, and JSON road audit reports for municipal records.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">CSV Export</h3>
            <p className="text-xs text-slate-400 mt-1">Full dataset with GPS coordinates, severity levels, and timestamps.</p>
          </div>
          <button
            onClick={handleDownloadCSV}
            className="w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs hover:bg-emerald-500/30 flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">PDF Executive Report</h3>
            <p className="text-xs text-slate-400 mt-1">Formatted executive summary with charts, road health index, and task status.</p>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="w-full py-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs hover:bg-rose-500/30 flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-glow border border-cyan-500/30 mx-auto flex items-center justify-center">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">JSON API Export</h3>
            <p className="text-xs text-slate-400 mt-1">Structured JSON payload for GIS database integration & microservices.</p>
          </div>
          <button
            onClick={handleDownloadJSON}
            className="w-full py-2.5 rounded-xl bg-cyan-500/20 text-cyan-glow border border-cyan-500/30 font-bold text-xs hover:bg-cyan-500/30 flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};
