import React from 'react';
import { Network, MessageSquare, CheckCircle, Users, Loader2, ArrowUpRight, Zap, RefreshCw } from 'lucide-react';
import { ConnectionState } from '../types';

interface DashboardStatsProps {
  shopId: string;
  status: ConnectionState;
  setActiveTab: (tab: (ConnectionState | any)) => void;
}

export default function DashboardStats({ shopId, status, setActiveTab }: DashboardStatsProps) {
  // Mock tenant statistics for demonstration
  const stats = [
    { name: 'Active Tenants', value: '47', change: '+12% this month', icon: Users, color: 'text-blue-500 bg-blue-50' },
    { name: 'Total Messages Handled', value: '184,204', change: '+3.4k in 24h', icon: MessageSquare, color: 'text-blue-600 bg-blue-50' },
    { name: 'Uptime (All Sockets)', value: '99.94%', change: 'Continuous', icon: Zap, color: 'text-amber-500 bg-amber-50' },
    { name: 'Average API Latency', value: '48 ms', change: 'Optimized', icon: Network, color: 'text-indigo-500 bg-indigo-50' },
  ];

  const statusColors = {
    disconnected: { label: 'Disconnected', color: 'bg-rose-50 text-rose-600 border-rose-200' },
    connecting: { label: 'Connecting', color: 'bg-amber-50 text-amber-600 border-amber-200 animate-pulse' },
    qr_received: { label: 'Waiting for Scan', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    connected: { label: 'Connected & Active', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  };

  const currentStatusObj = statusColors[status];

  return (
    <div className="space-y-6" id="dashboard-general-view">
      {/* Top Banner / Hero */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden" id="dashboard-hero-banner">
        <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 transform rotate-12">
          <Network className="w-48 h-48 text-blue-500" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10" id="hero-inner-content">
          <div>
            <span className="font-mono text-[10px] text-blue-400 font-bold tracking-wider uppercase mb-1 block">Platform Engine Multi-Tenant PoC</span>
            <h2 className="text-2xl font-sans font-bold text-white tracking-tight">WhatsApp Socket Autopilot Dashboard</h2>
            <p className="text-slate-400 text-xs mt-1.5 max-w-xl">
              Simulate or establish live Baileys sessions for independent tenant shops. Standardize QR generation streams and automate inbound replies in real-time.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('connect_bot')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-md shadow-blue-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
              id="hero-action-connect-bot"
            >
              <span>Manage current Session</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Key stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-all shadow-sm" id={`stats-card-${idx}`}>
            <div className="flex justify-between items-start">
              <span className="text-slate-500 text-[10px] font-bold tracking-wide uppercase font-mono">{item.name}</span>
              <div className={`p-2 rounded-lg ${item.color}`}>
                <item.icon className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold font-sans text-slate-900 tracking-tight">{item.value}</span>
              <p className="text-[10px] text-slate-400 mt-1 font-mono flex items-center gap-1">
                <span>{item.change}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Row representing the tenant context and the current selected tenant */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-details-row">
        {/* Left Card: Multi-Tenant Manager Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between lg:col-span-2" id="tenant-status-card">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-sans font-bold text-slate-800 text-sm">Tenant Connection Manager</h3>
                <p className="text-xs text-slate-400 mt-0.5">Control stateful communication context for shop sessions</p>
              </div>
              <span className={`px-2.5 py-0.5 font-mono text-[10px] font-bold rounded-full border ${currentStatusObj.color}`}>
                {currentStatusObj.label}
              </span>
            </div>

            <div className="border border-slate-100 rounded-lg p-4 bg-slate-50/50 space-y-3 mb-6">
              <div className="flex justify-between text-xs border-b border-slate-100/60 pb-2.5">
                <span className="text-slate-500 font-medium">Currently Selected Tenant ID:</span>
                <span className="font-mono font-bold text-slate-800">{shopId}</span>
              </div>
              <div className="flex justify-between text-xs border-b border-slate-100/60 pb-2.5">
                <span className="text-slate-500 font-medium">Auto-Reply Automation hook:</span>
                <span className="text-blue-600 font-mono font-semibold">Enabled</span>
              </div>
              <div className="flex justify-between text-xs pb-1">
                <span className="text-slate-500 font-medium">Express Socket Server link:</span>
                <span className="font-mono text-slate-800">ws://localhost:3000/socket.io</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={() => setActiveTab('connect_bot')}
              className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg active:scale-[0.99] transition-all text-center"
              id="card-btn-view-channel"
            >
              Open Session controls
            </button>
          </div>
        </div>

        {/* Right Card: Platform Tenancy Map */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm overflow-hidden flex flex-col justify-between" id="tenancy-map-card">
          <div>
            <h3 className="font-sans font-bold text-slate-800 text-sm">Active Tenants Monitor</h3>
            <p className="text-xs text-slate-400 mt-0.5 mb-4">Live connection statuses across tenant network</p>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 font-mono text-xs" id="tenants-list-container">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                  <span className="font-bold text-slate-800">{shopId} (Current)</span>
                </div>
                <span className="text-[9px] font-semibold text-blue-600 uppercase">
                  {status === 'connected' ? 'Connected' : 'Scanner Ready'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span className="font-bold text-slate-800 animate-none">shop_premium_01</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 uppercase">Connected</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span className="font-bold text-slate-800 animate-none">shop_custom_outlet</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 uppercase">Connected</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 opacity-60">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                  <span className="font-bold text-slate-800">shop_offline_demo</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Disconnected</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-mono">Total Tenants loaded: 4</span>
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
