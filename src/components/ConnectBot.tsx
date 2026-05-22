import React, { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react'; 
import { ShieldCheck, Loader2, AlertCircle, RefreshCw, Smartphone, CheckSquare, Zap } from 'lucide-react';
import { ConnectionState, BotLogMessage } from '../types';

interface ConnectBotProps {
  status: ConnectionState;
  qrCode?: string;
  shopId: string;
  simulateMode: boolean;
  onGenerateQR: () => void;
  onResetSession: () => void;
  onSimulateScanSuccess: () => void;
  logs: BotLogMessage[];
  clearLogs: () => void;
  onSimulateIncoming: (sender: string, text: string) => void;
}

export default function ConnectBot({
  status,
  qrCode,
  shopId,
  simulateMode,
  onGenerateQR,
  onResetSession,
  onSimulateScanSuccess
}: ConnectBotProps) {

  const stateConfig = {
    disconnected: {
      title: 'WhatsApp Disconnected',
      desc: 'The bot session is completely disconnected. Trigger a new authentication sequence to link a mobile client.',
      badgeClass: 'bg-rose-50 text-rose-600 border-rose-200',
      statusLabel: 'Disconnected',
    },
    connecting: {
      title: 'Connecting & Initializing',
      desc: 'Booting up the multi-tenant socket container on the Node container. Creating authentication multi-file directories...',
      badgeClass: 'bg-amber-50 text-amber-600 border-amber-200 animate-pulse',
      statusLabel: 'Connecting',
    },
    qr_received: {
      title: 'WhatsApp QR Code Generated',
      desc: 'Open WhatsApp on your mobile, tap Menu or Settings, select Linked Devices, and aim your camera at the QR code below.',
      badgeClass: 'bg-blue-50 text-blue-600 border-blue-200',
      statusLabel: 'Awaiting Authorization',
    },
    connected: {
      title: 'WhatsApp Client Authorized',
      desc: 'A live socket connection exists between this tenant and WhatsApp Web gateways. Messages are actively scanned and handled.',
      badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      statusLabel: 'Connected & Listening',
    }
  };

  const currentConfig = stateConfig[status];

  return (
    <div className="space-y-6" id="connect-bot-view">
      {/* Intro Header */}
      <div>
        <h2 className="text-xl font-sans font-bold text-slate-900 tracking-tight">System Connect Node & Baileys Auth</h2>
        <p className="text-sm text-slate-500 mt-1">
          Each tenant handles authentication of their automated WhatsApp bot. Click generate to output a secure QR code below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" id="connect-bot-grid-layout">
        {/* Connection status card left */}
        <div className="lg:col-span-3 space-y-6" id="connection-card-column">
          {/* Main Status card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm relative overflow-hidden" id="status-card">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4" id="status-card-header">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">SESSION AUDITOR</span>
                <h3 className="font-sans font-bold text-slate-800 text-base flex items-center gap-1.5 mt-0.5">
                  <span>WhatsApp Connection Status</span>
                </h3>
              </div>
              <span className={`px-3 py-1 text-xs font-mono font-bold rounded-full border ${currentConfig.badgeClass}`} id="connection-state-badge">
                ● {currentConfig.statusLabel}
              </span>
            </div>

            <div className="border border-slate-100 rounded-lg p-5 bg-slate-50/50 space-y-4" id="status-card-properties">
              <div className="text-sm text-slate-600 leading-relaxed">
                {currentConfig.desc}
              </div>

              {/* Status attributes */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 font-mono text-xs text-slate-500">
                <div>
                  <span className="block text-[10px] uppercase text-slate-400 pb-0.5">ACTIVE TENANT</span>
                  <span className="font-bold text-slate-700">{shopId}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-slate-400 pb-0.5">BOT RUNNING ENGINE</span>
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    {simulateMode ? (
                      <>
                        <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Interactive Simulator</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Baileys Socket Service</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap gap-3" id="status-card-actions">
              {status === 'disconnected' && (
                <button
                  type="button"
                  onClick={onGenerateQR}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-md shadow-blue-500/10 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                  id="generate-qr-action-btn"
                >
                  <RefreshCw className="w-4 h-4 text-blue-100 animate-spin-slow" />
                  <span>Generate QR Code</span>
                </button>
              )}

              {status === 'connecting' && (
                <div className="flex items-center gap-2 text-blue-600 font-mono text-xs bg-blue-50 border border-blue-100 rounded-lg px-4 py-2" id="initializing-spinner-banner">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Establishing socket handshake...</span>
                </div>
              )}

              {(status === 'qr_received' || status === 'connected') && (
                <button
                  type="button"
                  onClick={onResetSession}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-lg transition-all active:scale-[0.98]"
                  id="reset-session-action-btn"
                >
                  Reset & Terminate Session
                </button>
              )}
            </div>
          </div>

          {/* Quick tenant tip card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5" id="developer-notes-card">
            <h4 className="font-sans font-bold text-slate-700 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 font-mono">
              <AlertCircle className="w-4 h-4 text-slate-500" />
              <span>Multi-Tenancy Architecture Check</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every WhatsApp session mapped to a <code className="bg-slate-200/70 px-1 py-0.5 rounded text-blue-600 font-mono font-bold">shopId</code> maintains independent, persistent local credentials disk paths (<code className="bg-slate-200/70 px-1 py-0.5 rounded text-rose-800 font-mono">/auth_info_&lt;shopId&gt;</code>) so they reside as isolated Node server-side tasks. Feel free to modify the tenant Shop ID in the sidebar to simulate independent socket behaviors!
            </p>
          </div>
        </div>

        {/* Dynamic QR viewer right */}
        <div className="lg:col-span-2 flex flex-col justify-stretch" id="qr-display-container">
          {status === 'disconnected' && (
            <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center text-slate-400 h-full min-h-[300px]" id="qr-empty-placeholder">
              <Smartphone className="w-12 h-12 text-slate-300 mb-3 animate-pulse" />
              <h4 className="font-bold text-sm text-slate-700 mb-1">No scan challenge pending</h4>
              <p className="text-xs max-w-[200px] leading-relaxed mx-auto">
                First click <span className="font-semibold text-blue-600">Generate QR Code</span> above to link this tenant.
              </p>
            </div>
          )}

          {status === 'connecting' && (
            <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center text-slate-400 h-full min-h-[300px]" id="qr-generating-placeholder">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-3" />
              <h4 className="font-bold text-sm text-slate-700 mb-1">Spawning Baileys process</h4>
              <p className="text-xs max-w-[200px] leading-relaxed mx-auto">
                Allocating container credentials cache directory and awaiting QR payload event stream.
              </p>
            </div>
          )}

          {status === 'qr_received' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center h-full" id="qr-received-card">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-center mb-4 transition-all hover:scale-105 shadow-inner" id="qrcode-canvas-wrapper">
                {qrCode ? (
                  <QRCodeSVG 
                    value={qrCode} 
                    size={200}
                    bgColor={"#ffffff"}
                    fgColor={"#0f172a"}
                    level={"L"}
                    includeMargin={true}
                  />
                ) : (
                  <div className="w-[200px] h-[200px] bg-slate-100 animate-pulse flex items-center justify-center text-xs font-mono">Waiting for payload...</div>
                )}
              </div>

              <div className="w-full space-y-3">
                <span className="text-[10px] font-mono bg-blue-50 border border-blue-100 text-blue-600 rounded px-2.5 py-1 block truncate max-w-full font-bold">
                  Payload: {qrCode}
                </span>

                {simulateMode ? (
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <h5 className="text-[10px] font-mono text-blue-600 font-bold uppercase tracking-wider">Demo Quick Scan Bypass</h5>
                    <button
                      type="button"
                      onClick={onSimulateScanSuccess}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-md shadow-blue-500/10 transition-all flex items-center justify-center gap-1 active:scale-[0.98]"
                      id="simulate-scan-complete-btn"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Simulate QR Scan Success</span>
                    </button>
                    <p className="text-[10px] text-slate-400">
                      Instantly pairing mock WA client without needing a physical mobile!
                    </p>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400">
                    Scan the code above inside your authenticated WhatsApp app to build the real-world socket connection link.
                  </p>
                )}
              </div>
            </div>
          )}

          {status === 'connected' && (
            <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]" id="qr-connected-badge-card">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mb-4 animate-bounce" id="success-shield-container">
                <ShieldCheck className="w-9 h-9 text-emerald-600" />
              </div>
              <h4 className="font-sans font-bold text-slate-800 text-base mb-1">Secure session established!</h4>
              <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed mx-auto">
                No scanning pending. Autopilot is ready to process inbound Webhook triggers! Try simulation controls below.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
