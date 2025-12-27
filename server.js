const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// --- Mock Database ---
const CATALOG = [
  { id: '1', title: 'Midnight Horizon', displayArtist: 'Lunar Boy', primaryGenre: 'Electronic', status: 'distributed', coverArtUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop', upc: '840293482391', type: 'Single' },
  { id: '2', title: 'Neon Dreams', displayArtist: 'Cyber Soul', primaryGenre: 'Synthwave', status: 'ai-review', coverArtUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop', upc: 'PENDING', type: 'EP' },
  { id: '3', title: 'Quantum Drift', displayArtist: 'Vector Space', primaryGenre: 'Ambient', status: 'ready', coverArtUrl: 'https://images.unsplash.com/photo-1506259091721-347f798065f5?q=80&w=600&auto=format&fit=crop', upc: '840293112233', type: 'Album' }
];

const ANALYTICS = [
    { name: '00:00', streams: 1240 },
    { name: '04:00', streams: 850 },
    { name: '08:00', streams: 2400 },
    { name: '12:00', streams: 3800 },
    { name: '16:00', streams: 4200 },
    { name: '20:00', streams: 5100 },
    { name: '23:59', streams: 3200 },
];

const BUILD_LOGS = [
    { message: "╔═══════════════════════════════════════════════════════════════╗", type: 'command' },
    { message: "║   LinkZ IAED Mobile - APK Builder v2.0.1                      ║", type: 'command' },
    { message: "╚═══════════════════════════════════════════════════════════════╝", type: 'command' },
    { message: "# Checking Node.js...", type: 'info' },
    { message: "✓ Node.js 18+ detected", type: 'success' },
    { message: "# Checking Expo CLI...", type: 'info' },
    { message: "Installing Expo CLI...", type: 'warning' },
    { message: "$ npm install -g expo-cli", type: 'command' },
    { message: "✅ Prerequisites checked", type: 'success' },
    { message: "# Installing dependencies...", type: 'info' },
    { message: "$ npm install", type: 'command' },
    { message: "✅ Dependencies installed", type: 'success' },
    { message: "# Login to Expo account...", type: 'info' },
    { message: "$ eas login", type: 'command' },
    { message: "✓ Logged in as studio-156266", type: 'success' },
    { message: "# Configuring EAS Build...", type: 'info' },
    { message: "$ eas build:configure", type: 'command' },
    { message: "✅ Project configured (eas.json)", type: 'success' },
    { message: "# Building APK...", type: 'info' },
    { message: "$ eas build -p android --profile preview", type: 'command' },
    { message: "› Uploading project to EAS Build...", type: 'info' },
    { message: "› Build queued...", type: 'info' },
    { message: "› Gradle build running...", type: 'info' },
    { message: "› apply plugin: 'com.android.application'", type: 'info' },
    { message: "› compileSdkVersion 33", type: 'info' },
    { message: "› Compiling resources...", type: 'info' },
    { message: "✅ APK Built Successfully!", type: 'success' },
    { message: "Download: https://expo.dev/artifacts/android/build-8239.apk", type: 'success' },
    { message: "QR Code generated for device install.", type: 'info' }
];

// --- REST Endpoints ---
app.get('/health', (req, res) => {
    res.json([
        { name: 'Expo Build Service', status: 'running', port: 'EAS', latency: '45ms' },
        { name: 'Android Build', status: 'running', port: 'Gradle', latency: '12ms' },
        { name: 'Metro Bundler', status: 'running', port: '8081', latency: '5ms' },
        { name: 'LinkZ API', status: 'running', port: '3001', latency: '1ms' },
    ]);
});

app.get('/v1/dashboard/stats', (req, res) => {
    res.json({
        assets: 1248,
        streams: 89432,
        nodes: 42,
        metaIndex: 98,
        queue: []
    });
});

app.get('/v1/catalog/releases', (req, res) => res.json(CATALOG));

app.get('/v1/analytics/streams', (req, res) => res.json(ANALYTICS));

app.post('/v1/builds', (req, res) => {
    console.log('Build triggered:', req.body);
    setTimeout(() => {
        res.json({ buildId: `build-${Date.now()}` });
    }, 800);
});

// --- HTTP Server & WebSocket ---
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
    console.log(`Socket connected: ${req.url}`);
    
    // Simulate build logs streaming
    if (req.url.includes('/logs')) {
        let i = 0;
        const interval = setInterval(() => {
            if (i >= BUILD_LOGS.length) {
                clearInterval(interval);
                return;
            }
            ws.send(JSON.stringify(BUILD_LOGS[i]));
            i++;
        }, 500); // 500ms delay between logs

        ws.on('close', () => clearInterval(interval));
    }
});

server.listen(PORT, () => {
    console.log(`LinkZ Local API running on http://localhost:${PORT}`);
    console.log(`WebSocket endpoint ready at ws://localhost:${PORT}`);
});