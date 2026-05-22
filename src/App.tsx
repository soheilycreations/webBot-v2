import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { ActiveTab, ConnectionState, BotLogMessage } from './types';
import Sidebar from './components/Sidebar';
import DashboardStats from './components/DashboardStats';
import ConnectBot from './components/ConnectBot';
import KnowledgeBase from './components/KnowledgeBase';
import LogsPanel from './components/LogsPanel';
import AiConfig from './components/AiConfig';
import { MessageSquare, Bot, AlertCircle, CircleDot } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [shopId, setShopId] = useState<string>('shop_123');
  const [simulateMode, setSimulateMode] = useState<boolean>(true);
  
  const [status, setStatus] = useState<ConnectionState>('disconnected');
  const [qrCode, setQrCode] = useState<string | undefined>(undefined);
  const [logs, setLogs] = useState<BotLogMessage[]>([]);

  const socketRef = useRef<Socket | null>(null);

  // Initialize Socket.io connection and listeners
  useEffect(() => {
    // Connect to current origin directly, so routing works perfectly in sandbox, dev, and production
    const socket = io();
    socketRef.current = socket;

    // Log connection confirmation
    addSystemLog('info', '[Websocket Client] Establishing multiplex stream tunnel to backend server...');

    socket.on('connect', () => {
      addSystemLog('success', `[Websocket Client] Stream connected! Tunnel established: ID ${socket.id}`);
      
      // Initialize with active shop context
      socket.emit('initialize', { shopId, simulate: simulateMode });
    });

    socket.on('disconnect', () => {
      addSystemLog('warn', '[Websocket Client] Stream disconnected. Attempting automatic socket recovery...');
      setStatus('disconnected');
    });

    socket.on('status_change', (data: { status: ConnectionState; qrCode?: string }) => {
      setStatus(data.status);
      if (data.qrCode) {
        setQrCode(data.qrCode);
      } else {
        setQrCode(undefined);
      }
    });

    socket.on('log', (data: { type: 'info' | 'success' | 'warn' | 'error' | 'message'; message: string }) => {
      addSystemLog(data.type, data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Re-emit initialize if shopId or simulateMode changes
  useEffect(() => {
    if (socketRef.current && socketRef.current.connected) {
      addSystemLog('info', `[Tenancy Switch] Selected Shop context changed to: ${shopId} (Simulation: ${simulateMode})`);
      socketRef.current.emit('initialize', { shopId, simulate: simulateMode });
    }
  }, [shopId, simulateMode]);

  // Append a message to the real-time logs terminal
  const addSystemLog = (type: BotLogMessage['type'], message: string) => {
    const timeString = new Date().toLocaleTimeString();
    setLogs((prev) => [
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: timeString,
        type,
        message
      },
      ...prev
    ]);
  };

  const handleGenerateQR = () => {
    if (socketRef.current) {
      setQrCode(undefined);
      socketRef.current.emit('generate_qr', { shopId });
    }
  };

  const handleResetSession = async () => {
    try {
      addSystemLog('info', `[Audit API] Dispatching teardown challenge to backend for tenant: ${shopId}`);
      const response = await fetch('/api/sessions/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId })
      });
      const data = await response.json();
      if (data.success) {
        setStatus('disconnected');
        setQrCode(undefined);
        addSystemLog('warn', `[Audit Success] Session states successfully flushed. Auth paths cleaned.`);
      }
    } catch (e: any) {
      addSystemLog('error', `[Audit Error] Could not register teardown challenge request: ${e.message}`);
    }
  };

  const handleSimulateScanSuccess = () => {
    if (socketRef.current) {
      socketRef.current.emit('simulate_scan_success');
    }
  };

  const handleSimulateIncoming = (sender: string, text: string) => {
    if (socketRef.current) {
      socketRef.current.emit('simulate_incoming_msg', { sender, text });
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 antialiased overflow-hidden" id="applet-viewport">
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        shopId={shopId}
        setShopId={setShopId}
        simulateMode={simulateMode}
        setSimulateMode={setSimulateMode}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden" id="main-content-layout">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-250 bg-white flex items-center justify-between px-8 shrink-0 animate-fade-in" id="top-navbar">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 7.54 16.59c-.4.49-.9 1.13-1.12 1.58-.23.46-.22.97-.22 1.45a2 2 0 0 1-2 2h-4.4a2 2 0 0 1-2-2c0-.48.01-.99-.22-1.45-.22-.45-.72-1.09-1.12-1.58A10 10 0 0 1 12 2Z"/></svg>
            <h1 className="font-sans font-bold text-xs text-slate-800 uppercase tracking-wider">
              Control Center / Tenant Auto-Route Hub
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] bg-blue-50 border border-blue-200 font-bold py-1 px-2.5 rounded text-blue-600 font-mono">
              Active Tenant ID: {shopId}
            </span>
          </div>
        </header>

        {/* Dynamic Inner Panel View scroll */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6" id="dashboard-scrollable-body">
          {activeTab === 'dashboard' && (
            <DashboardStats
              shopId={shopId}
              status={status}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'connect_bot' && (
            <ConnectBot
              status={status}
              qrCode={qrCode}
              shopId={shopId}
              simulateMode={simulateMode}
              onGenerateQR={handleGenerateQR}
              onResetSession={handleResetSession}
              onSimulateScanSuccess={handleSimulateScanSuccess}
              logs={logs}
              clearLogs={clearLogs}
              onSimulateIncoming={handleSimulateIncoming}
            />
          )}

          {activeTab === 'knowledge_base' && <KnowledgeBase />}

          {activeTab === 'ai_config' && <AiConfig shopId={shopId} />}

          {/* Persistent Logs Terminal shown at the bottom of the current tab view for supreme developer experience */}
          <div className="pt-4" id="persistent-stream-drawer">
            <LogsPanel
              logs={logs}
              clearLogs={clearLogs}
              onSimulateIncoming={handleSimulateIncoming}
              status={status}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
