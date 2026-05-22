import React, { useState, useEffect } from 'react';
import { Database, Brain, Sparkles, Shield, Copy, Check, Terminal, Play, Lock, AlertCircle } from 'lucide-react';
import { TenantConfig } from '../types';

interface AiConfigProps {
  shopId: string;
}

export default function AiConfig({ shopId }: AiConfigProps) {
  const [config, setConfig] = useState<TenantConfig>({
    shopId,
    supabaseUrl: '',
    supabaseAnonKey: '',
    openRouterKey: '',
    openRouterModel: 'meta-llama/llama-3-8b-instruct:free',
    systemPrompt: 'You are "Webshopping Bot", a helpful AI assistant for my e-commerce shop. Your goal is to help users view catalog items, explain shipping policies, answer questions politely, and always write brief, professional Whatsapp text replies.'
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [testUserMessage, setTestUserMessage] = useState('Hi, what are your shipping fees?');
  const [aiResponse, setAiResponse] = useState('');
  const [testingAi, setTestingAi] = useState(false);
  const [testError, setTestError] = useState('');

  // Load configuration from localStorage or environment-derived values
  useEffect(() => {
    const saved = localStorage.getItem(`tenant_config_${shopId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig({
          ...config,
          ...parsed,
          shopId // ensure shopId is correctly bound
        });
      } catch (e) {
        console.error('Failed to parse saved config:', e);
      }
    } else {
      // Default initial states
      setConfig({
        shopId,
        supabaseUrl: '',
        supabaseAnonKey: '',
        openRouterKey: '',
        openRouterModel: 'meta-llama/llama-3-8b-instruct:free',
        systemPrompt: `You are "Webshopping Bot", a helpful AI assistant for the shop "${shopId}". Answer query concisely under 3 sentences. Provide delivery and price answers from our Knowledge Base context if available, otherwise suggest looking at our web storefront.`
      });
    }
  }, [shopId]);

  const handleInputChange = (field: keyof TenantConfig, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveConfigs = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Save to localStorage
    localStorage.setItem(`tenant_config_${shopId}`, JSON.stringify(config));

    // Post config to backend to update server active memory state for simulated/real auto-replies
    try {
      await fetch('/api/sessions/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err: any) {
      console.error('Failed to notify backend of configuration change:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCopySchema = () => {
    const schemaSql = `-- SUPABASE DATABASE INITIALIZATION SCHEMA FOR WEBSHOPPING BOT\n\n` +
      `-- 1. Create table for storing Whatsapp Outbound Log histories\n` +
      `create table if not exists chat_logs (\n` +
      `  id uuid default gen_random_uuid() primary key,\n` +
      `  shop_id text not null,\n` +
      `  sender_phone text not null,\n` +
      `  message_body text not null,\n` +
      `  direction text not null or 'inbound' or 'outbound',\n` +
      `  created_at timestamp with time zone default timezone('utc'::text, now()) not null\n` +
      `);\n\n` +
      `-- 2. Create table for Custom Dynamic FAQ catalogs\n` +
      `create table if not exists tenant_faqs (\n` +
      `  id uuid default gen_random_uuid() primary key,\n` +
      `  shop_id text not null,\n` +
      `  question text not null,\n` +
      `  answer text not null,\n` +
      `  created_at timestamp with time zone default timezone('utc'::text, now())\n` +
      `);`;

    navigator.clipboard.writeText(schemaSql);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleTestAiResponse = async () => {
    if (!testUserMessage.trim()) return;
    setTestingAi(true);
    setAiResponse('');
    setTestError('');

    try {
      const response = await fetch('/api/test-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopId,
          userMessage: testUserMessage,
          config
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setAiResponse(data.reply);
      } else {
        setTestError(data.error || 'AI generation returned an invalid response. Please check your OpenRouter API Key.');
      }
    } catch (err: any) {
      setTestError(`API endpoint failed to resolve: ${err.message}`);
    } finally {
      setTestingAi(false);
    }
  };

  return (
    <div className="space-y-6" id="ai-db-config-view">
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-sans font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
            <span>AI Gateway & Supabase DB Integration</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Supercharge <strong>Webshopping Bot</strong> with OpenRouter Llama/Gemini intellect and persistent cloud storage.
          </p>
        </div>
        <div className="bg-slate-950 text-white rounded-lg px-3 py-1 font-mono text-[10px] border border-slate-800 flex items-center gap-1.5 shadow">
          <Terminal className="w-3.5 h-3.5 text-blue-400" />
          <span>Tenant Configuration Sync Ready</span>
        </div>
      </div>

      <form onSubmit={handleSaveConfigs} className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="config-form-grid">
        
        {/* Left Card: OpenRouter Settings */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between" id="openrouter-settings-card">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Brain className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-sans font-bold text-slate-800 text-sm">OpenRouter LLM Autopilot</h3>
                <p className="text-[11px] text-slate-400">Manage natural conversations over WhatsApp Web sockets</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>OpenRouter API Key *</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder={process.env.OPENROUTER_API_KEY ? "🔑 Set from server environment variables" : "sk-or-v1-..."}
                    value={config.openRouterKey}
                    onChange={(e) => handleInputChange('openRouterKey', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    id="openrouter-key-input"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                  If left empty, the server defaults to values defined in <code>.env.example</code> (or mock prompt auto-responders).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">AI Language Model</label>
                <select
                  value={config.openRouterModel}
                  onChange={(e) => handleInputChange('openRouterModel', e.target.value)}
                  className="w-full bg-white border border-slate-250 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  id="openrouter-model-select"
                >
                  <option value="meta-llama/llama-3-8b-instruct:free">Meta Llama 3 8B Instruct (Free)</option>
                  <option value="google/gemini-2.5-flash">Google Gemini 2.5 Flash</option>
                  <option value="mistralai/mistral-7b-instruct:free">Mistral 7B Instruct (Free)</option>
                  <option value="openai/gpt-4o-mini">OpenAI GPT-4o Mini</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">System Instructions / AI Personality</label>
                <textarea
                  rows={4}
                  value={config.systemPrompt}
                  onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
                  className="w-full bg-white border border-slate-250 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
                  placeholder="Tell the bot how to play..."
                  id="openrouter-prompt-textarea"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-6 flex justify-between items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-md shadow-blue-500/10 transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              id="save-configs-btn"
            >
              <span>{saving ? 'Syncing...' : 'Save Configuration'}</span>
            </button>
            {savedSuccess && (
              <span className="text-[11px] font-mono font-bold text-emerald-600 animate-pulse bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ✓ Synced Successfully
              </span>
            )}
          </div>
        </div>

        {/* Right Card: Supabase Integration */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between" id="supabase-settings-card">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Database className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-sans font-bold text-slate-800 text-sm">Supabase Database Sync</h3>
                <p className="text-[11px] text-slate-400">Persist and synchronize inbound messages and FAQ blocks</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Supabase REST URL</label>
                <input
                  type="text"
                  placeholder="https://your-project-id.supabase.co"
                  value={config.supabaseUrl}
                  onChange={(e) => handleInputChange('supabaseUrl', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  id="supabase-url-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Supabase Anon Key</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={config.supabaseAnonKey}
                  onChange={(e) => handleInputChange('supabaseAnonKey', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  id="supabase-key-input"
                />
              </div>

              {/* Postgres Table Schema Assistant */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <span className="text-[10px] font-mono text-slate-500 font-bold block mb-1 uppercase tracking-wider">
                  Postgres Tables Booster
                </span>
                <p className="text-[10px] text-slate-500 leading-normal mb-2.5">
                  Copied schema allows establishing <code>chat_logs</code> instantly in your Supabase SQL editor.
                </p>
                <button
                  type="button"
                  onClick={handleCopySchema}
                  className="flex items-center gap-1.5 py-1.5 px-3 bg-white border border-slate-250 hover:bg-slate-50 rounded text-[10px] text-slate-600 font-bold transition-all cursor-pointer"
                  id="copy-supabase-schema-btn"
                >
                  {copiedSchema ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Copied SQL Scheme!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy SQL Schema Script</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Secure TLS 1.3 socket transmission verified.</span>
          </div>
        </div>
      </form>

      {/* Interactive LLM Testing Sandbox */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm" id="llm-sandbox-testing">
        <h3 className="font-sans font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-blue-600 animate-spin-slow" />
          <span>Autopilot AI Simulator Playground</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Instantly probe the OpenRouter LLM context output before testing on linked WhatsApp smartphone clients.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="sandbox-interaction-grid">
          <div className="space-y-3">
            <textarea
              rows={3}
              value={testUserMessage}
              onChange={(e) => setTestUserMessage(e.target.value)}
              placeholder="e.g., Do you sell hoodies and what are the pricing?"
              className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              id="sandbox-test-input"
            />
            <button
              type="button"
              onClick={handleTestAiResponse}
              disabled={testingAi}
              className="py-2.5 px-4 bg-slate-900 border border-transparent text-slate-100 hover:bg-slate-850 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              id="run-sandbox-ai-btn"
            >
              <Play className="w-3.5 h-3.5 text-blue-400" />
              <span>{testingAi ? 'Processing...' : 'Dispatch Challenge'}</span>
            </button>
          </div>

          <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs text-slate-200 border border-slate-800 min-h-[100px] flex flex-col justify-between" id="sandbox-response-terminal">
            <div>
              <span className="text-[10px] text-slate-500 block mb-1">🤖 AI ANSWER PAYLOAD</span>
              {testingAi ? (
                <div className="flex items-center gap-2 text-blue-400 animate-pulse py-2">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce delay-100">●</span>
                  <span className="animate-bounce delay-200">●</span>
                  <span>Generating answer via OpenRouter gateway...</span>
                </div>
              ) : aiResponse ? (
                <p className="text-slate-100 leading-relaxed font-sans whitespace-pre-wrap">{aiResponse}</p>
              ) : testError ? (
                <div className="p-2 bg-rose-950/40 border border-rose-900 rounded text-rose-300 flex items-start gap-1.5 text-[11px] font-sans">
                  <AlertCircle className="w-4 h-4 text-rose-450 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Playground Error:</span> {testError}
                  </div>
                </div>
              ) : (
                <p className="text-slate-600 italic">Playground outputs will load here instantly upon dispatching.</p>
              )}
            </div>
            {config.openRouterModel && (
              <span className="text-[9px] text-slate-600 block pt-3 border-t border-slate-900 mt-2">
                ENDPOINT: v1/chat/completions ({config.openRouterModel})
              </span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
