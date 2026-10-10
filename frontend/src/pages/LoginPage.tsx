import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Mail, User as UserIcon, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const isRegisterInitial = location.pathname.includes('register');
  const [isRegister, setIsRegister] = useState<boolean>(isRegisterInitial);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('CITIZEN');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        const res = await api.register({
          email,
          password,
          full_name: fullName,
          role,
        });
        login(res.data.access_token, res.data.user);
        navigate('/dashboard');
      } else {
        const res = await api.login({ email, password });
        login(res.data.access_token, res.data.user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPwd: string) => {
    setEmail(demoEmail);
    setPassword(demoPwd);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md p-8 glass-panel rounded-3xl border border-cyan-500/30 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-cyan-400 mx-auto flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Shield className="w-8 h-8 text-slate-950 font-bold" />
          </div>
          <h1 className="text-2xl font-bold font-sans text-white">
            {isRegister ? 'Create PathGuardian Account' : 'Sign In to Portal'}
          </h1>
          <p className="text-xs text-slate-400">
            {isRegister ? 'Select your role and start road monitoring.' : 'Access AI detection, maps, and maintenance workflows.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(null); }}
            className={`py-2 rounded-lg transition-all ${!isRegister ? 'bg-cyan-500/20 text-cyan-glow border border-cyan-500/30' : 'text-slate-400 hover:text-white'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(null); }}
            className={`py-2 rounded-lg transition-all ${isRegister ? 'bg-cyan-500/20 text-cyan-glow border border-cyan-500/30' : 'text-slate-400 hover:text-white'}`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Inspector Alex"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pathguardian.org"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">User Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs focus:border-cyan-500 focus:outline-none"
              >
                <option value="CITIZEN">Citizen / Viewer</option>
                <option value="INSPECTOR">Road Inspector</option>
                <option value="WORKER">Maintenance Worker</option>
                <option value="AUTHORITY">Government Authority</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 hover:brightness-110 transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Accounts */}
        <div className="pt-4 border-t border-white/10 text-center space-y-2">
          <p className="text-[11px] font-mono text-cyan-400">Quick Demo Credentials (Click to fill):</p>
          <div className="flex flex-wrap justify-center gap-1.5 text-[10px]">
            <button
              onClick={() => fillDemoAccount('admin@pathguardian.org', 'admin123')}
              className="px-2 py-1 rounded bg-white/5 border border-white/10 hover:border-cyan-500 text-slate-300"
            >
              Admin
            </button>
            <button
              onClick={() => fillDemoAccount('authority@pathguardian.org', 'authority123')}
              className="px-2 py-1 rounded bg-white/5 border border-white/10 hover:border-cyan-500 text-slate-300"
            >
              Authority
            </button>
            <button
              onClick={() => fillDemoAccount('inspector@pathguardian.org', 'inspector123')}
              className="px-2 py-1 rounded bg-white/5 border border-white/10 hover:border-cyan-500 text-slate-300"
            >
              Inspector
            </button>
            <button
              onClick={() => fillDemoAccount('worker@pathguardian.org', 'worker123')}
              className="px-2 py-1 rounded bg-white/5 border border-white/10 hover:border-cyan-500 text-slate-300"
            >
              Worker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
