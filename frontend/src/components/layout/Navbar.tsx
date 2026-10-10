import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Bell, User as UserIcon, LogOut, Cpu, Flame, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    if (isAuthenticated) {
      api.listNotifications()
        .then((res) => {
          const unread = res.data.filter((n) => !n.is_read).length;
          setUnreadCount(unread);
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-4 lg:px-8 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-cyan-glow hover:bg-white/5 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <span className="text-xl font-bold font-sans tracking-wide bg-gradient-to-r from-white via-slate-100 to-cyan-glow bg-clip-text text-transparent">
              PathGuardian
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-glow border border-cyan-500/30">
              v1.0 AI Engine
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-5">
        {/* Real-time System Status Badge */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400">YOLOv8 Active</span>
        </div>

        {isAuthenticated ? (
          <>
            {/* Notification Bell */}
            <Link
              to="/notifications"
              className="relative p-2 rounded-xl glass-panel text-slate-300 hover:text-cyan-glow hover:border-cyan-500/40 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-hazard-high text-white text-[11px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* User Profile Badge */}
            <div className="flex items-center space-x-3 pl-2 border-l border-white/10">
              <Link to="/profile" className="flex items-center space-x-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-cyan-500/30 flex items-center justify-center text-cyan-glow font-bold group-hover:border-cyan-400 transition-colors">
                  {user?.full_name ? user.full_name.charAt(0) : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-cyan-glow transition-colors">
                    {user?.full_name}
                  </p>
                  <p className="text-[10px] font-mono text-cyan-400/80 uppercase">
                    {user?.role}
                  </p>
                </div>
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                title="Logout"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-cyan-glow transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 transition-all shadow-lg shadow-cyan-500/25"
            >
              Register Portal
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
