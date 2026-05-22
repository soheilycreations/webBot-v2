'use client';

/**
 * Multi-Tenant WhatsApp Bot Dashboard (Next.js App Router Component)
 * Communicates with the stateful Node.js + Socket.io backend on port 5000.
 */

import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Bot, 
  LayoutDashboard, 
  MessageSquare, 
  BookOpen, 
  Shield, 
  User, 
  RefreshCw, 
  Smartphone, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  Terminal,
  Trash2
} from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('connect_bot'); // "Dashboard", "Connect Bot", "Knowledge Base"
  const [shopId, setShopId] = useState('shop_123'); // Multi-tenant mock shop context
  const [status, setStatus] = useState('disconnected'); // disconnected, connecting, qr_received, connected
  const [qrCode, setQrCode] = useState('');
  const [logs, setLogs] = useState([]);
  
  const socketRef = useRef(null);

  // Synchronize WebSocket connection automatically
  useEffect(() => {
    // Connect to the standalone backend on localhost:5000
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const socket = io(BACKEND_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
    
    socketRef.current = socket;

    addLog('info', `[Socket] Initiating socket handshake: ${BACKEND_URL}`);

    socket.on('connect', () => {
      addLog('success', `[Socket] Connected stream initialized with ID: ${socket.id}`);
      
      // Send initial context with tenant ID
      socket.emit('initialize', { shopId });
    });

    socket.on('disconnect', () => {
      addLog('warn', '[Socket] Connection closed by remote host.');
      setStatus('disconnected');
    });

    socket.on('status_change', (data) => {
      setStatus(data.status);
      if (data.qrCode) {
        setQrCode(data.qrCode);
      } else {
        setQrCode('');
      }
    });

    socket.on('log', (data) => {
      addLog(data.type, data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [shopId]); // Refresh connection if current tenant shopId shifts

  const addLog = (type, message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { id: Math.random().toString(), timestamp, type, message },
      ...prev
    ]);
  };

  const handleGenerateQR = () => {
    if (socketRef.current) {
      setQrCode('');
      socketRef.current.emit('generate_qr', { shopId });
    }
  };

  const handleResetSession = async () => {
    try {
      addLog('info', `[API] Dispatching session reset call for shop ${shopId}...`);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${BACKEND_URL}/api/sessions/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId })
      });
      const data = await response.json();
      if (data.success) {
        setStatus('disconnected');
        setQrCode('');
        addLog('warn', `[API] Session directory successfully flushed.`);
      }
    } catch (err) {
      addLog('error', `[API] Failed to reset session: ${err.message}`);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 antialiased overflow-hidden">
      
      {/* 1. SIDEBAR NAVIGATION CONTAINER */}
      <aside className="w-80 bg-slate-900 text-slate-100 flex flex-col justify-between border-r border-slate-800">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="font-sans font-bold tracking-tight text-lg text-white leading-tight">OmniBot</h1>
              <span className="font-mono text-[9px] text-emerald-400 font-semibold tracking-wider uppercase">Multi-Tenant Platform</span>
            </div>
          </div>

          {/* Tenant Selector */}
          <div className="p-5 border-b border-slate-800/60 bg-slate-950/40">
            <label className="block text-slate-400 text-[10px] font-mono mb-2 uppercase tracking-wider">Tenant Config Context</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Shield className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={shopId}
                onChange={(e) => setShopId(e.target.value)}
                placeholder="Enter Tenant ID..."
                className="w-full bg-slate-900 border border-slate-700/60 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm transition-all text-left ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500/10 text-emerald-400 font-medium border-l-[3px] border-emerald-500 pl-[13px]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span>Dashboard Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('connect_bot')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm transition-all text-left ${
                activeTab === 'connect_bot'
                  ? 'bg-emerald-500/10 text-emerald-400 font-medium border-l-[3px] border-emerald-500 pl-[13px]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <MessageSquare className="w-4.5 h-4.5" />
              <span>Connect Bot (Active)</span>
            </button>

            <button
              onClick={() => setActiveTab('knowledge_base')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm transition-all text-left ${
                activeTab === 'knowledge_base'
                  ? 'bg-emerald-500/10 text-emerald-400 font-medium border-l-[3px] border-emerald-500 pl-[13px]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4.5 h-4.5" />
              <span>Knowledge Base</span>
            </button>
          </nav>
        </div>

        {/* Member Profile */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
              <User className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Platform Owner</p>
              <p className="text-[10px] font-mono text-emerald-500">Sockets Live</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN ACTIVE VIEW PORT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-rose-100 bg-white flex items-center justify-between px-8">
          <h2 className="text-sm font-sans font-bold text-slate-700 tracking-wider font-mono uppercase">
            Next.js App Router Workspace
          </h2>
          <span className="text-xs font-mono bg-sky-50 text-sky-700 px-2.5 py-1 rounded border border-sky-100 font-semibold">
            Connecting: {shopId}
          </span>
        </header>

        {/* Main Scrolling Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {activeTab === 'dashboard' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm">
              <h3 className="text-lg font-bold text-slate-800">Tenant Dashboard</h3>
              <p className="text-sm text-slate-500 mt-1">Unified multitenancy status statistics dashboard layout.</p>
            </div>
          )}

          {activeTab === 'knowledge_base' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm">
              <h3 className="text-lg font-bold text-slate-800">FAQ Core Config</h3>
              <p className="text-sm text-slate-500 mt-1">Write prompt mappings for automated WhatsApp auto responders.</p>
            </div>
          )}

          {activeTab === 'connect_bot' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold font-sans text-slate-900 tracking-tight">System Connect Node & Baileys Auth</h3>
                <p className="text-sm text-slate-500 mt-0.5">Initialize a dynamic socket stream to bind a WhatsApp device.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Connection Status Card */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">SESSION AUDITOR</span>
                        <h4 className="font-sans font-bold text-slate-800 text-base mt-0.5">WhatsApp Connection Status</h4>
                      </div>

                      {/* Status Badging */}
                      {status === 'disconnected' && (
                        <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-rose-50 border border-rose-200 text-rose-700">
                          ● Disconnected
                        </span>
                      )}
                      {status === 'connecting' && (
                        <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-amber-50 border border-amber-200 text-amber-700 animate-pulse">
                          ● Connecting
                        </span>
                      )}
                      {status === 'qr_received' && (
                        <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">
                          ● Awaiting Scan
                        </span>
                      )}
                      {status === 'connected' && (
                        <span className="px-3 py-1 text-xs font-mono font-bold rounded-full bg-emerald-50 border border-emerald-250 text-emerald-700">
                          ● Connected
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-6">
                      {status === 'disconnected' && 'The bot session is completely disconnected. Trigger a new authentication sequence to link a mobile client.'}
                      {status === 'connecting' && 'Opening Socket stream to the Node backend server to obtain authentication context challenges...'}
                      {status === 'qr_received' && 'QR code compiled successfully. Scan it inside your mobile device settings > Linked Devices.'}
                      {status === 'connected' && 'Session authenticated! Autopilot is actively running and processing hook triggers.'}
                    </p>

                    <div className="flex gap-3">
                      {status === 'disconnected' && (
                        <button
                          onClick={handleGenerateQR}
                          className="px-4 py-2 bg-slate-900 text-slate-100 hover:bg-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Generate QR Code</span>
                        </button>
                      )}
                      {(status === 'qr_received' || status === 'connected') && (
                        <button
                          onClick={handleResetSession}
                          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg transition-all"
                        >
                          Reset Bot Session
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <h5 className="font-sans font-semibold text-slate-700 text-xs uppercase flex items-center gap-1.5 mb-2">
                      <AlertCircle className="w-4 h-4 text-slate-500" />
                      <span>Tenant Persistence Layer</span>
                    </h5>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      This Next.js PoC maps authentication credentials on disk directories tied specifically to the tenant ID. Each session is managed in isolated state tasks.
                    </p>
                  </div>
                </div>

                {/* QR Display Card */}
                <div className="lg:col-span-2">
                  {status === 'disconnected' && (
                    <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center text-slate-400 h-full min-h-[250px]">
                      <Smartphone className="w-10 h-10 text-slate-300 mb-2" />
                      <h4 className="font-bold text-xs text-slate-700">No scanner challenge</h4>
                      <p className="text-[11px] mt-1 max-w-[150px] leading-relaxed mx-auto">Click generate QR code left.</p>
                    </div>
                  )}

                  {status === 'connecting' && (
                    <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center text-slate-400 h-full min-h-[250px]">
                      <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-2" />
                      <h4 className="font-bold text-xs text-slate-700">Generating handshake</h4>
                    </div>
                  )}

                  {status === 'qr_received' && (
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center h-full">
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-center mb-4 shadow-inner">
                        <QRCodeSVG value={qrCode} size={180} />
                      </div>
                      <span className="text-[9px] font-mono bg-indigo-50 border border-indigo-100 text-indigo-700 rounded px-2 py-0.5 max-w-full truncate block mb-1">
                        {qrCode}
                      </span>
                    </div>
                  )}

                  {status === 'connected' && (
                    <div className="bg-emerald-50/50 border border-emerald-250 rounded-xl p-6 flex flex-col items-center justify-center text-center h-full min-h-[250px]">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3 animate-ping">
                        ✓
                      </div>
                      <h4 className="font-bold text-sm text-slate-800">Bot Active!</h4>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* 3. PERSISTENT LIVE LOGS SECTION */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
            <div className="p-4 bg-slate-950 border-b border-slate-805 flex items-center justify-between">
              <span className="font-mono text-xs text-slate-200 flex items-center gap-1.5 font-bold">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Socket.io Connection Live Logger Stream</span>
              </span>
              <button
                onClick={() => setLogs([])}
                className="text-[10px] text-rose-400 flex items-center gap-1 hover:text-rose-300 font-mono"
              >
                <Trash2 className="w-3 h-3" />
                <span>Flush</span>
              </button>
            </div>
            <div className="p-4 bg-slate-950/90 h-44 overflow-y-auto font-mono text-[10px] space-y-1 text-slate-300 leading-relaxed">
              {logs.length === 0 ? (
                <div className="text-slate-500 text-center py-10">Stream idle. Connect states compile here...</div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex gap-2">
                    <span className="text-slate-600 shrink-0">{log.timestamp}</span>
                    <span className="text-emerald-400 font-semibold shrink-0">[{log.type.toUpperCase()}]</span>
                    <span>{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
