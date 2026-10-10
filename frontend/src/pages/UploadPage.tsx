import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileImage, Film, Cpu, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setProgress(20);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setProgress(60);
      const res = await api.uploadMedia(formData);
      setProgress(100);
      setSuccess(true);
      setTimeout(() => {
        navigate('/results');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Upload or AI processing failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold font-sans text-white flex items-center justify-center space-x-2">
          <UploadCloud className="w-6 h-6 text-cyan-glow" />
          <span>Road Media Upload & AI Inference</span>
        </h1>
        <p className="text-xs text-slate-400">
          Upload JPEG, PNG, WebP images or MP4 videos for YOLOv8 pothole detection & frame extraction.
        </p>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`p-10 rounded-3xl glass-panel border-2 border-dashed transition-all text-center space-y-4 ${
          dragActive
            ? 'border-cyan-400 bg-cyan-500/10'
            : file
            ? 'border-emerald-500/50 bg-emerald-500/5'
            : 'border-white/10 hover:border-cyan-500/30'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 mx-auto flex items-center justify-center text-cyan-glow border border-cyan-500/30">
          {file ? (
            file.type.startsWith('video/') ? (
              <Film className="w-8 h-8 text-cyan-glow" />
            ) : (
              <FileImage className="w-8 h-8 text-cyan-glow" />
            )
          ) : (
            <UploadCloud className="w-8 h-8 text-cyan-glow" />
          )}
        </div>

        {file ? (
          <div className="space-y-1">
            <p className="text-sm font-bold text-white">{file.name}</p>
            <p className="text-xs font-mono text-cyan-400">
              {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type || 'Unknown Format'}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-200">Drag and drop road image or video here</p>
            <p className="text-xs text-slate-400">or click below to browse files (Max 100MB)</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          id="file-upload-input"
          className="hidden"
        />

        <div className="flex justify-center space-x-3 pt-2">
          <label
            htmlFor="file-upload-input"
            className="px-4 py-2 rounded-xl glass-panel text-xs text-slate-200 hover:border-cyan-500/40 cursor-pointer"
          >
            {file ? 'Change File' : 'Select File'}
          </label>

          {file && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 flex items-center space-x-2"
            >
              {uploading ? (
                <span>Running AI Pipeline...</span>
              ) : (
                <>
                  <span>Process Media</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="glass-panel p-4 rounded-2xl space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-cyan-glow">Executing YOLOv8 Inference & Frame Processor</span>
            <span className="text-white">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Upload complete! Redirecting to AI detection results...</span>
        </div>
      )}
    </div>
  );
};
