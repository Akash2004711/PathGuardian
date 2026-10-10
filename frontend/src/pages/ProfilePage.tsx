import React from 'react';
import { UserCheck, Shield, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 text-center space-y-4">
        <div className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-glow mx-auto flex items-center justify-center text-2xl font-bold font-mono">
          {user?.full_name ? user.full_name.charAt(0) : 'U'}
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">{user?.full_name || 'System User'}</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">{user?.email}</p>
        </div>
        <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-glow border border-cyan-500/30 text-xs font-mono font-bold uppercase">
          {user?.role || 'CITIZEN'} ROLE
        </div>
      </div>
    </div>
  );
};
