import React from 'react';
import { LayoutDashboard, MessageSquare, BookOpen, Bot, Shield, User, CircleDot, Sparkles } from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  shopId: string;
  setShopId: (id: string) => void;
  simulateMode: boolean;
  setSimulateMode: (val: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  shopId,
  setShopId,
  simulateMode,
  setSimulateMode
}: SidebarProps) {
  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col justify-between" id="sidebar-container">
      <div>
        {/* Header / Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3" id="brand-header">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20" id="brand-logo-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
          </div>
          <div>
            <h1 className="font-sans font-bold tracking-tight text-white leading-tight">Webshopping Bot</h1>
            <span className="font-mono text-[9px] text-blue-400 font-bold tracking-wider uppercase">WHATSAPP PLATFORM</span>
          </div>
        </div>

        {/* Tenant Config Section */}
        <div className="p-5 border-b border-slate-800/60 bg-slate-950/40" id="tenant-config-section">
          <label className="block text-slate-400 text-[10px] font-mono mb-2 uppercase tracking-wider">Multi-Tenant Context</label>
          <div className="relative mb-3">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <Shield className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={shopId}
              onChange={(e) => setShopId(e.target.value)}
              placeholder="Enter Tenant Shop ID..."
              className="w-full bg-slate-900/90 border border-slate-700/60 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
              id="tenant-shop-id-input"
            />
          </div>
          
          <div className="flex items-center justify-between py-1 px-2 border border-slate-800 rounded bg-slate-900/40">
            <span className="text-[10px] text-slate-400 font-mono">Sandbox Simulator</span>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={simulateMode} 
                onChange={(e) => setSimulateMode((e.target as any).checked ?? e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-7 h-4 bg-slate-700 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
            </label>
          </div>
        </div>

        {/* Nav list */}
        <nav className="p-4 space-y-1.5" id="sidebar-main-nav">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-left group ${
              activeTab === 'dashboard'
                ? 'bg-blue-600/10 text-blue-400 font-semibold border border-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
            }`}
            id="nav-btn-dashboard"
          >
            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
            <span>Dashboard Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('connect_bot')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-left group ${
              activeTab === 'connect_bot'
                ? 'bg-blue-600/10 text-blue-400 font-semibold border border-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
            }`}
            id="nav-btn-connect"
          >
            <MessageSquare className={`w-5 h-5 ${activeTab === 'connect_bot' ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
            <span className="flex-1">Connect Bot</span>
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-450 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('knowledge_base')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-left group ${
              activeTab === 'knowledge_base'
                ? 'bg-blue-600/10 text-blue-400 font-semibold border border-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
            }`}
            id="nav-btn-knowledge"
          >
            <BookOpen className={`w-5 h-5 ${activeTab === 'knowledge_base' ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
            <span>Knowledge Base</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_config')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all text-left group ${
              activeTab === 'ai_config'
                ? 'bg-blue-600/10 text-blue-400 font-semibold border border-blue-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
            }`}
            id="nav-btn-ai-config"
          >
            <Sparkles className={`w-5 h-5 ${activeTab === 'ai_config' ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300 animate-pulse'}`} />
            <span>AI & DB Configuration</span>
          </button>
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/20" id="sidebar-footer">
        <div className="flex items-center gap-3" id="user-profile">
          <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-300 text-sm font-semibold">
            <User className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{shopId} Admin</p>
            <div className="flex items-center gap-1.5">
              <CircleDot className="w-2 h-2 text-blue-500 animate-pulse" />
              <p className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">PRO PLAN</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
