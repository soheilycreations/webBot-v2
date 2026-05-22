export type ConnectionState = 'disconnected' | 'connecting' | 'qr_received' | 'connected';

export type ActiveTab = 'dashboard' | 'connect_bot' | 'knowledge_base' | 'ai_config';

export interface WhatsAppSession {
  shopId: string;
  status: ConnectionState;
  qrCode?: string;
  connectedAt?: string;
}

export interface BotLogMessage {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'message';
  message: string;
}

export interface TenantConfig {
  shopId: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  openRouterKey: string;
  openRouterModel: string;
  systemPrompt: string;
}
