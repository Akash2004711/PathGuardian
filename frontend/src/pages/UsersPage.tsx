import React, { useEffect, useState } from 'react';
import { Users, Shield, UserCheck, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { User, UserRole } from '../types';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = () => {
    setLoading(true);
    api.listUsers()
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to load users", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user role", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-sans text-white flex items-center space-x-2">
            <Users className="w-6 h-6 text-cyan-glow" />
            <span>User & Role Management</span>
          </h1>
          <p className="text-xs text-slate-400">Manage platform users, role assignments (Admin, Authority, Inspector, Worker, Citizen).</p>
        </div>

        <button
          onClick={fetchUsers}
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
                <th className="p-4">Full Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Role</th>
                <th className="p-4">Account Status</th>
                <th className="p-4">Role Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-mono">
                    Loading users list...
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-white">{u.full_name}</td>
                    <td className="p-4 font-mono">{u.email}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-glow border border-cyan-500/30">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-emerald-400 font-mono text-[11px]">ACTIVE</span>
                    </td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="px-2 py-1 rounded bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-500"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="AUTHORITY">AUTHORITY</option>
                        <option value="INSPECTOR">INSPECTOR</option>
                        <option value="WORKER">WORKER</option>
                        <option value="CITIZEN">CITIZEN</option>
                      </select>
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
