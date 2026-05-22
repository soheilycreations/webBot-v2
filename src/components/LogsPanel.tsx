import React, { useState } from 'react';
import { Terminal, Send, Trash2, ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { BotLogMessage, ConnectionState } from '../types';

interface LogsPanelProps {
  logs: BotLogMessage[];
  clearLogs: () => void;
  onSimulateIncoming: (sender: string, text: string) => void;
  status: ConnectionState;
}

export default function LogsPanel({ logs, clearLogs, onSimulateIncoming, status }: LogsPanelProps) {
  const [customMsg, setCustomMsg] = useState('');
  const [customSender, setCustomSender] = useState('+1 (555) 789-0123');

  const handleSubmitSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    onSimulateIncoming(customSender, customMsg);
    setCustomMsg('');
  };

  const quickMessages = [
    { text: "What are your business hours?", sender: "+55 (11) 98765-4321" },
    { text: "I'd like to check my order status for tenant_id_101", sender: "+1 (415) 555-2671" },
    { text: "Hello! Is the AI bot online?", sender: "+44 7911 123456" }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-full" id="logs-panel-container">
      {/* Logs Dashboard Panel Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between" id="logs-panel-header">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" />
          <span className="font-sans font-bold text-sm text-slate-200">Real-Time WebSocket & Bot Live logs</span>
        </div>
        <button
          onClick={clearLogs}
          disabled={logs.length === 0}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 disabled:opacity-40 transition-all font-mono hover:bg-rose-500/10 rounded"
          id="clear-logs-btn"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear stream</span>
        </button>
      </div>

      {/* Actual Live Log Console output terminal */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-2 bg-slate-950/80 min-h-[300px] max-h-[350px]" id="terminal-body-log">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12" id="logs-empty-view">
            <ArrowRightLeft className="w-6 h-6 mb-2 text-slate-600 animate-pulse" />
            <span>Connection terminal is idle. State updates stream here...</span>
          </div>
        ) : (
          logs.map((log) => {
            let color = 'text-slate-300';
            let label = 'SYSTEM';
            if (log.type === 'success') { color = 'text-blue-400'; label = 'SUCCESS'; }
            if (log.type === 'warn') { color = 'text-amber-400'; label = 'WARNING'; }
            if (log.type === 'error') { color = 'text-rose-450 font-semibold'; label = 'CRITICAL ERROR'; }
            if (log.type === 'message') { color = 'text-sky-300'; label = 'WHATSAPP'; }

            return (
              <div key={log.id} className="border-b border-slate-900 pb-1.5 flex gap-2 items-start" id={`log-${log.id}`}>
                <span className="text-slate-600 shrink-0">{log.timestamp}</span>
                <span className={`font-bold shrink-0 ${color}`}>[{label}]</span>
                <span className={log.type === 'message' ? 'text-sky-100 font-medium' : color}>{log.message}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Simulator Actions trigger panel */}
      <div className="p-4 bg-slate-950 border-t border-slate-850" id="logs-simulator-controls">
        <div className="mb-3">
          <h4 className="text-xs text-slate-400 font-bold mb-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Simulate incoming WhatsApp text event</span>
          </h4>
          <p className="text-[10px] text-slate-500">
            {status !== 'connected' 
              ? "⚠️ Bot offline. Select 'Connect Bot', scan the QR, then fire simulated messages!" 
              : "Fire mock messages over Socket.io connections to test webhook handlers and automated reply modules."}
          </p>
        </div>

        {/* Quick buttons */}
        <div className="flex flex-wrap gap-1.5 mb-3" id="quick-sim-buttons">
          {quickMessages.map((msg, i) => (
            <button
              key={i}
              type="button"
              disabled={status !== 'connected'}
              onClick={() => onSimulateIncoming(msg.sender, msg.text)}
              className="px-2.5 py-1 text-[10px] bg-slate-900 border border-slate-800 hover:border-blue-600/50 hover:bg-slate-850 text-slate-300 rounded font-mono disabled:opacity-40 transition-all text-left truncate max-w-full"
              id={`quick-test-btn-${i}`}
            >
              "{msg.text}"
            </button>
          ))}
        </div>

        {/* Custom trigger form */}
        <form onSubmit={handleSubmitSimulate} className="space-y-2" id="custom-simulation-form">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-slate-500 font-mono mb-0.5">Sender Mobile</label>
              <input
                type="text"
                value={customSender}
                onChange={(e) => setCustomSender(e.target.value)}
                disabled={status !== 'connected'}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono disabled:opacity-50"
                id="sim-sender-input"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-mono mb-0.5 font-bold">Text Message String</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder="Type mock message..."
                  disabled={status !== 'connected'}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  id="sim-payload-input"
                />
                <button
                  type="submit"
                  disabled={status !== 'connected' || !customMsg.trim()}
                  className="bg-blue-600 text-white rounded px-3 py-1 font-bold text-xs disabled:opacity-50 transition-all hover:bg-blue-500 shrink-0 flex items-center justify-center cursor-pointer active:scale-[0.98]"
                  id="send-sim-msg-btn"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
