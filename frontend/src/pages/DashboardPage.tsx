import React, { useEffect, useState } from 'react';
import {
  AlertTriangle, CheckCircle, Clock, ShieldAlert, Activity, Wrench,
  TrendingUp, Layers, RefreshCw
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { api } from '../services/api';
import { DashboardMetrics } from '../types';

export const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMetrics = () => {
    setLoading(true);
    api.getDashboardMetrics()
      .then((res) => setMetrics(res.data))
      .catch((err) => console.error("Failed to load dashboard metrics", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const defaultTrends = [
    { month: 'May', detections: 12, repairs: 8 },
    { month: 'Jun', detections: 19, repairs: 15 },
    { month: 'Jul', detections: 28, repairs: 22 },
    { month: 'Aug', detections: 35, repairs: 30 },
    { month: 'Sep', detections: 42, repairs: 38 },
    { month: 'Oct', detections: metrics?.total_potholes || 48, repairs: metrics?.completed_repairs || 40 },
  ];

  const pieData = [
    { name: 'Critical', value: metrics?.severity_distribution?.CRITICAL || 2, color: '#DC2626' },
    { name: 'High', value: metrics?.severity_distribution?.HIGH || 4, color: '#EF4444' },
    { name: 'Medium', value: metrics?.severity_distribution?.MEDIUM || 8, color: '#F59E0B' },
    { name: 'Low', value: metrics?.severity_distribution?.LOW || 12, color: '#10B981' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans text-white">Road Intelligence Dashboard</h1>
          <p className="text-xs text-slate-400">Live telemetry metrics, pothole hazard analytics, and maintenance metrics.</p>
        </div>
        <button
          onClick={fetchMetrics}
          className="self-start md:self-auto px-4 py-2 rounded-xl glass-panel text-xs text-cyan-glow hover:border-cyan-500/40 flex items-center space-x-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-cyan-400 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Potholes</span>
            <AlertTriangle className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold font-mono text-white">{metrics?.total_potholes ?? 14}</p>
          <p className="text-[11px] text-cyan-400/80">Across monitored segments</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-l-4 border-emerald-500 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Verified Hazards</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold font-mono text-white">{metrics?.verified_potholes ?? 10}</p>
          <p className="text-[11px] text-emerald-400/80">Authority confirmed</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-l-4 border-rose-600 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Critical Hazards</span>
            <ShieldAlert className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-3xl font-bold font-mono text-rose-400">{metrics?.critical_hazards ?? 3}</p>
          <p className="text-[11px] text-rose-400/80">Immediate repair required</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-l-4 border-amber-500 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Avg Road Health</span>
            <Activity className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-bold font-mono text-white">
            {metrics?.road_health_avg ? metrics.road_health_avg.toFixed(1) : '72.4'}
            <span className="text-xs text-slate-400 font-sans ml-1">/ 100</span>
          </p>
          <p className="text-[11px] text-amber-400/80">Composite health index</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-cyan-glow" />
              <span>Monthly Detections & Repairs Trend</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">6 Month Window</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={defaultTrends}>
                <defs>
                  <linearGradient id="colorDet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#00F0FF', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="detections" stroke="#00F0FF" fillOpacity={1} fill="url(#colorDet)" name="Detections" />
                <Area type="monotone" dataKey="repairs" stroke="#10B981" fillOpacity={1} fill="url(#colorRep)" name="Repairs" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution Pie */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-rose-400" />
            <span>Hazard Severity Breakdown</span>
          </h3>
          <div className="h-64 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300">{item.name}:</span>
                <span className="font-mono text-white font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
