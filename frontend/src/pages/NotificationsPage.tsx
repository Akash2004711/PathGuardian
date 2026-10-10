import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { api } from '../services/api';
import { NotificationItem } from '../types';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotifs = () => {
    setLoading(true);
    api.listNotifications()
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Failed to load notifications", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-sans text-white flex items-center space-x-2">
          <Bell className="w-6 h-6 text-cyan-glow" />
          <span>In-App Notification Center</span>
        </h1>
        <p className="text-xs text-slate-400">Critical hazard alerts, work order dispatches, and repair completion notifications.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-500 font-mono">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 glass-panel rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-white">No Unread Notifications</p>
            <p className="text-xs text-slate-400">You are up to date on all system alerts.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl glass-panel border flex items-start justify-between space-x-4 ${
                n.is_read ? 'border-white/5 opacity-70' : 'border-cyan-500/30 bg-cyan-500/5'
              }`}
            >
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">{n.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">{n.message}</p>
                  <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {!n.is_read && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-glow text-xs font-semibold hover:bg-cyan-500/30"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
