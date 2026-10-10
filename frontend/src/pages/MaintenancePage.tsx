import React, { useEffect, useState } from 'react';
import { Wrench, CheckCircle2, Clock, User, ShieldAlert, Plus } from 'lucide-react';
import { api } from '../services/api';
import { MaintenanceRequest, MaintenanceStatus } from '../types';

export const MaintenancePage: React.FC = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRequests = () => {
    setLoading(true);
    api.listMaintenanceRequests()
      .then((res) => setRequests(res.data))
      .catch((err) => console.error("Failed to load maintenance requests", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id: string, newStatus: MaintenanceStatus) => {
    try {
      await api.updateMaintenanceStatus(id, { status: newStatus, notes: `Status updated to ${newStatus}` });
      fetchRequests();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans text-white flex items-center space-x-2">
            <Wrench className="w-6 h-6 text-cyan-glow" />
            <span>Smart Maintenance Management</span>
          </h1>
          <p className="text-xs text-slate-400">Task dispatching, worker assignments, priority queues, and repair history audit trails.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-500 font-mono">
            Loading maintenance tasks...
          </div>
        ) : requests.length === 0 ? (
          <div className="col-span-full p-8 glass-panel rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-white">No Maintenance Requests Pending</p>
            <p className="text-xs text-slate-400">All verified hazards have been repaired and closed.</p>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {req.priority} PRIORITY
                </span>
                <span className="text-xs font-mono font-bold text-cyan-glow">{req.status}</span>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-slate-300 font-semibold">{req.notes || 'Pothole asphalt patch repair dispatched.'}</p>
                <p className="text-slate-500 font-mono text-[10px]">
                  Created: {new Date(req.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Worker: {req.assigned_worker_id ? 'Assigned' : 'Unassigned'}</span>
                {req.status !== 'CLOSED' && (
                  <button
                    onClick={() => handleStatusChange(req.id, req.status === 'ASSIGNED' ? 'IN_PROGRESS' : 'WORK_COMPLETED')}
                    className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-glow border border-cyan-500/40 text-[11px] hover:bg-cyan-500/30"
                  >
                    Advance Status
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
