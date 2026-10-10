import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Box, UploadCloud, Eye, History, MapPin, Navigation,
  Activity, Wrench, ShieldCheck, Bell, FileSpreadsheet, Users, Settings,
  UserCheck, HelpCircle, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const isAuthority = user?.role === 'ADMIN' || user?.role === 'AUTHORITY';

  const menuSections = [
    {
      title: 'CORE PLATFORM',
      items: [
        { label: '3D Landing Portal', path: '/', icon: Sparkles },
        { label: 'Live Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: '3D Road Intelligence', path: '/3d-intelligence', icon: Box },
        { label: 'Interactive Pothole Map', path: '/map', icon: MapPin },
      ]
    },
    {
      title: 'AI COMPUTER VISION',
      items: [
        { label: 'Upload Road Media', path: '/upload', icon: UploadCloud },
        { label: 'AI Detection Results', path: '/results', icon: Eye },
        { label: 'Processing Job History', path: '/jobs', icon: History },
        { label: 'Model Configuration', path: '/model-config', icon: Settings },
      ]
    },
    {
      title: 'GIS & ROAD ANALYTICS',
      items: [
        { label: 'GPS / GPX Telemetry', path: '/gps', icon: Navigation },
        { label: 'Road Health Analytics', path: '/road-health', icon: Activity },
      ]
    },
    {
      title: 'OPERATIONS & REPAIRS',
      items: [
        { label: 'Maintenance Hub', path: '/maintenance', icon: Wrench },
        ...(isAuthority ? [{ label: 'Authority Verification', path: '/authority', icon: ShieldCheck }] : []),
        { label: 'Reports & Exports', path: '/reports', icon: FileSpreadsheet },
        { label: 'Notification Center', path: '/notifications', icon: Bell },
      ]
    },
    {
      title: 'ADMIN & SYSTEM',
      items: [
        ...(isAdmin ? [{ label: 'User Management', path: '/users', icon: Users }] : []),
        { label: 'System Settings', path: '/settings', icon: Settings },
        { label: 'User Profile', path: '/profile', icon: UserCheck },
        { label: 'Documentation & Help', path: '/docs', icon: HelpCircle },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-[65px] bottom-0 left-0 z-40 w-64 glass-panel border-r border-white/10 p-4 transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <h3 className="px-3 text-[11px] font-mono font-semibold tracking-wider text-cyan-400/70 uppercase">
                {section.title}
              </h3>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-glow border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};
