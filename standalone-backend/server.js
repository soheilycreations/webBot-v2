/**
 * Standalone Node.js + Express + Socket.io Server for Multi-Tenant WhatsApp Bot Platform
 * Resolves CORS with Next.js (port 3000) and delegates connections to whatsappManager.
 */

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import whatsappManager from './whatsappManager.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for external requests
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Next.js default port is 3000
  credentials: true
}));

app.use(express.json());

// API - Reset Session
app.post('/api/sessions/reset', async (req, res) => {
  const { shopId } = req.body;
  if (!shopId) {
    return res.status(400).json({ error: 'Missing shopId parameter' });
  }

  try {
    await whatsappManager.discardSession(shopId);
    res.json({ success: true, message: `Purged credentials directory cache for tenant ${shopId}.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const server = http.createServer(app);

// Enable Socket.io server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log(`[Socket] Connected socket client: ${socket.id}`);
  
  let currentShopId = null;

  // Client initializes connection by sending tenant context details
  socket.on('initialize', ({ shopId }) => {
    if (!shopId) return;
    currentShopId = shopId;
    
    // Join tenant-specific socket room
    socket.join(`shop_${shopId}`);
    console.log(`[Socket] Channel client ${socket.id} joined Room shop_${shopId}`);

    // Delegate Baileys session verification
    whatsappManager.initializeSession(shopId, io, socket);
  });

  socket.on('generate_qr', ({ shopId }) => {
    if (!shopId) return;
    whatsappManager.initializeSession(shopId, io, socket);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Disconnected socket client: ${socket.id}`);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(`🚀 Multi-Tenant WhatsApp Backend Server Live!`);
  console.log(`🔌 Listening on Port: ${PORT}`);
  console.log(`⚙️  Origin CORS Target: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`===============================================`);
});
