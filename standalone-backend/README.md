# Standalone WhatsApp Bot Backend (Multi-Tenant)

A standalone Node.js, Express, and Socket.io server integrated with `@whiskeysockets/baileys` to generate, stream, and authorize WhatsApp Web QR connection states dynamically per tenant context.

## Prerequisites
- Node.js LTS (v18 or newer recommended)
- npm or yarn

## Installation

1. Navigate to the backend directory:
   ```bash
   cd standalone-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration
Optionally create a `.env` file in this directory to override default parameters:
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## Running the Server

- **Development Mode** (with hot reloading via nodemon):
  ```bash
  npm run dev
  ```

- **Production Mode**:
  ```bash
  npm start
  ```

## Key Sockets Event APIs
- **Inbound Event subscriptions (listen)**:
  - `status_change` `{ status: 'disconnected' | 'connecting' | 'qr_received' | 'connected', qrCode?: string }`
  - `log` `{ type: 'info' | 'success' | 'warn' | 'error' | 'message', message: string }`

- **Outbound triggers (emit)**:
  - `initialize` `{ shopId: "shop_123" }`
  - `generate_qr` `{ shopId: "shop_123" }`
