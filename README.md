# EV Charger Dashboard - Frontend

This is the frontend web application for the Wi-SUN based EV Charging Station. It provides a modern, responsive, mobile-first interface for users to initiate, monitor, and manage charging sessions.

It is built as a **Progressive Web App (PWA)**, allowing users to install it directly on their home screens for a native app-like experience.

## Tech Stack

- **Framework**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (Global state), React Query (Server state/API caching)
- **Routing**: React Router DOM
- **UI Components**: Lucide React (Icons), Recharts (Data visualization), React Hot Toast (Notifications)
- **PWA**: Vite PWA Plugin

## Project Structure

```text
src/
├── assets/        # Static assets (images, icons)
├── components/    # Reusable UI components (Navbar, ProtectedRoutes, Buttons)
├── pages/         # Top-level route pages (Home, Login, Admin, QR)
├── services/      # API communication layer (api.ts)
├── stores/        # Zustand global state (useChargerStore.ts)
├── types/         # TypeScript interface definitions
├── App.tsx        # Main application component & Router configuration
└── main.tsx       # React entry point
```

## Key Features

1. **Real-Time Charging Progress**: The `Home.tsx` dashboard automatically syncs with the physical PZEM sensor via the Node.js backend. It calculates the live charging percentage by fetching actual `Wh` telemetry, ensuring the web interface exactly matches the physical charger state.
2. **QR Code Routing**: Users can scan physical QR codes (e.g., `https://domain.com/qr/EV001`), which will automatically identify the charger station and redirect them to the start charging dashboard.
3. **Admin Dashboard**: A secure interface with charts and tables for administrators to view charging history, total revenue, and manage users.
4. **Offline Resilience**: As a PWA with service workers enabled, the app loads quickly even on spotty connections.

## Local Development Setup

### 1. Install Dependencies
Make sure you have Node.js installed, then run:
```bash
npm install
```

### 2. Configure Backend Proxy
During development, the frontend proxy forwards API calls to your backend border router.
Check `vite.config.ts` and ensure the proxy target points to your Border Router's IP (e.g., `http://10.2.131.182:3000`).

### 3. Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### 4. Build for Production
To generate minified, optimized static files for deployment (e.g., to an Nginx server):
```bash
npm run build
```
The compiled files will be output to the `dist/` directory.

## API Integration (`src/services/api.ts`)

The frontend relies strictly on the REST API exposed by the Node.js backend.
- **Session Management**: `POST /api/session/start`, `POST /api/session/stop`
- **Live Telemetry**: `GET /api/pzem/latest` (Used by the progress bar)
- **Authentication**: `POST /api/auth/login`, `POST /api/auth/register`
- **Admin Data**: `GET /api/session/history`, `GET /api/station`
