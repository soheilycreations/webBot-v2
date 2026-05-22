# Standalone Next.js WhatsApp Bot Frontend

An interactive Next.js App Router workspace utilizing Tailwind CSS, Lucide React, and Socket.io-client to connect to our stateful backend server on port 5000. It supports starting sessions, displaying status changes, rendering SVG QR codes, and logging transaction events live.

## Prerequisites
- Node.js LTS (v18 or newer recommended)
- npm or yarn

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd standalone-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration
Before booting up, optionally declare your backend URL configuration inside `.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

## Running the Application (Development)

Run the local Next.js dev server:
```bash
npm run dev
```

The interface will be served at [http://localhost:3000](http://localhost:3000).

## Code Structure Walkthrough

- **`src/app/dashboard/page.js`**: Contains the primary React client controller. It binds to the backend Socket context and establishes automatic room subscription channels based on the input Tenant ID (`shopId`).
- **`QRCodeSVG`**: Dynamically generates vectorized pixel maps on the browser client without server rendering overhead.
