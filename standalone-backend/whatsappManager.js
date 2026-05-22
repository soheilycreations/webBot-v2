/**
 * WhatsApp Socket Connections Manager (Multi-Tenant)
 * Manages independent '@whiskeysockets/baileys' authentication channels
 * mapped to specific shopIds.
 */

import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import pino from 'pino';
import path from 'path';
import fs from 'fs';

class WhatsAppManager {
  constructor() {
    this.sessions = new Map(); // Store active Baileys socket links by shopId
  }

  /**
   * Initializes or returns a WhatsApp session for a specific shopId
   * @param {string} shopId - Tenant identifier
   * @param {object} io - Socket.io instance
   * @param {object} clientSocket - Specific connecting client socket
   */
  async initializeSession(shopId, io, clientSocket) {
    console.log(`[Manager] Initializing session request for shopId: ${shopId}`);

    // If an active connection exists, send their status immediately
    if (this.sessions.has(shopId)) {
      const activeSession = this.sessions.get(shopId);
      clientSocket.emit('status_change', {
        status: activeSession.status,
        qrCode: activeSession.qrCode
      });
      return;
    }

    // Initialize session state in map
    this.sessions.set(shopId, {
      status: 'connecting',
      sock: null,
      qrCode: null
    });

    // Notify client
    io.to(`shop_${shopId}`).emit('status_change', { status: 'connecting' });
    io.to(`shop_${shopId}`).emit('log', {
      type: 'info',
      message: `[Tenancy] Allocating state credentials for: ${shopId}...`
    });

    try {
      // Set up persistent authentication directories for this tenant context
      const authFolder = path.join(process.cwd(), `auth_info_${shopId}`);
      const { state, saveCreds } = await useMultiFileAuthState(authFolder);

      // Spawn Baileys connection
      const sock = makeWASocket.default({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
      });

      // Update session map reference
      const sessionData = this.sessions.get(shopId);
      sessionData.sock = sock;

      // Listen to credentials save triggers
      sock.ev.on('creds.update', saveCreds);

      // Listen to Connection cycles
      sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          console.log(`[Baileys - ${shopId}] New QR Code emitted.`);
          sessionData.status = 'qr_received';
          sessionData.qrCode = qr;
          this.sessions.set(shopId, sessionData);

          io.to(`shop_${shopId}`).emit('status_change', {
            status: 'qr_received',
            qrCode: qr
          });
          io.to(`shop_${shopId}`).emit('log', {
            type: 'info',
            message: `[Auth] QR scan challenge received. Waiting for scanner.`
          });
        }

        if (connection === 'close') {
          const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
          console.log(`[Baileys - ${shopId}] Connection closed. Reconnecting: ${shouldReconnect}`);

          sessionData.status = 'disconnected';
          sessionData.qrCode = null;
          this.sessions.set(shopId, sessionData);

          io.to(`shop_${shopId}`).emit('status_change', { status: 'disconnected' });
          io.to(`shop_${shopId}`).emit('log', {
            type: 'warn',
            message: `[System] Connection terminated. Auto-reconnecting: ${shouldReconnect}`
          });

          if (shouldReconnect) {
            // Queue reconnect
            this.sessions.delete(shopId);
            setTimeout(() => {
              this.initializeSession(shopId, io, clientSocket);
            }, 5000);
          }
        } else if (connection === 'open') {
          console.log(`[Baileys - ${shopId}] Connection opened successfully.`);
          sessionData.status = 'connected';
          sessionData.qrCode = null;
          this.sessions.set(shopId, sessionData);

          io.to(`shop_${shopId}`).emit('status_change', { status: 'connected' });
          io.to(`shop_${shopId}`).emit('log', {
            type: 'success',
            message: `[System] Node linked successfully to client WhatsApp!`
          });
        }
      });

      // Listen to incoming group/direct messages
      sock.ev.on('messages.upsert', async (m) => {
        console.log(`[Incoming Message - ${shopId}]:`, JSON.stringify(m, null, 2));

        const msg = m.messages[0];
        if (!msg.key.fromMe && msg.message) {
          const textMessage = msg.message.conversation || msg.message.extendedTextMessage?.text;
          const sender = msg.key.remoteJid;

          if (textMessage) {
            // Broadcast live receipt log back to frontend subscribers
            io.to(`shop_${shopId}`).emit('log', {
              type: 'message',
              message: `[INCOMING] Message from ${sender}: "${textMessage}"`
            });

            // Auto reply script
            try {
              await sock.sendMessage(sender, {
                text: `[OmniBot Autopilot] Thank you for writing us! Your message has been routed to human agents.`
              });
              io.to(`shop_${shopId}`).emit('log', {
                type: 'success',
                message: `[OUTBOUND-REPLY] Auto response sent to ${sender}`
              });
            } catch (err) {
              console.error(`Failed to send auto-reply for shop ${shopId}:`, err);
            }
          }
        }
      });

    } catch (err) {
      console.error(`[Manager - ${shopId}] Initialization error:`, err);
      io.to(`shop_${shopId}`).emit('log', {
        type: 'error',
        message: `Initialization crashed: ${err.message}`
      });
      this.sessions.delete(shopId);
    }
  }

  /**
   * Resets and cleans credentials for a shopId
   * @param {string} shopId 
   */
  async discardSession(shopId) {
    if (this.sessions.has(shopId)) {
      const session = this.sessions.get(shopId);
      if (session.sock) {
        try {
          await session.sock.logout();
        } catch (e) {
          // already closed
        }
      }
      this.sessions.delete(shopId);
    }

    const authFolder = path.join(process.cwd(), `auth_info_${shopId}`);
    if (fs.existsSync(authFolder)) {
      fs.rmSync(authFolder, { recursive: true, force: true });
    }
    console.log(`[Manager] Discarded and purged directory cache for shopId: ${shopId}`);
  }
}

export default new WhatsAppManager();
