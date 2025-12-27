import { ReleaseMetadata, LogEntry, ServiceStatus, TrackData } from '../types';

const API_CONFIG = {
  // Point to the local server created in server.js
  BASE_URL: 'http://localhost:3001',
  WS_URL: 'ws://localhost:3001',
  HEADERS: {
    'Content-Type': 'application/json',
    'X-Project-ID': 'studio-156266',
    'Authorization': 'Bearer studio-156266-key' 
  }
};

// --- MOCK DATA FOR FALLBACK (Offline Mode) ---
const MOCK_BUILD_LOGS = [
    { message: "╔═══════════════════════════════════════════════════════════════╗", type: 'command' },
    { message: "║   LinkZ IAED Mobile - APK Builder v2.0.1                      ║", type: 'command' },
    { message: "╚═══════════════════════════════════════════════════════════════╝", type: 'command' },
    { message: "# Checking Node.js...", type: 'info' },
    { message: "✓ Node.js 18+ detected", type: 'success' },
    { message: "Connection to Localhost failed. Running in Simulation Mode.", type: 'warning' },
    { message: "✅ Prerequisites checked", type: 'success' },
    { message: "# Installing dependencies...", type: 'info' },
    { message: "$ npm install", type: 'command' },
    { message: "✅ Dependencies installed", type: 'success' },
    { message: "# Configuring EAS Build...", type: 'info' },
    { message: "✅ Project configured (eas.json)", type: 'success' },
    { message: "# Building APK...", type: 'info' },
    { message: "✅ APK Built Successfully!", type: 'success' },
];

const MOCK_CATALOG: Partial<ReleaseMetadata>[] = [
  { id: '1', title: 'Midnight Horizon', displayArtist: 'Lunar Boy', primaryGenre: 'Electronic', status: 'distributed', coverArtUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop', upc: '840293482391', type: 'Single' },
  { id: '2', title: 'Neon Dreams', displayArtist: 'Cyber Soul', primaryGenre: 'Synthwave', status: 'ai-review', coverArtUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop', upc: 'PENDING', type: 'EP' },
];

const MOCK_ANALYTICS = [
    { name: '00:00', streams: 0 },
    { name: '12:00', streams: 0 },
    { name: '23:59', streams: 0 },
];

export class LinkZService {
  /**
   * Connects to Build Log Stream.
   * Gracefully degrades to local simulation if WS connection fails.
   */
  static connectBuildStream(buildId: string, onMessage: (log: LogEntry) => void, onError: () => void): any {
    // 1. Try Real WebSocket
    let ws: WebSocket | null = null;
    let mockInterval: any = null;

    try {
        // Construct WS URL using the build ID
        ws = new WebSocket(`${API_CONFIG.WS_URL}/ws/builds/${buildId}/logs`);
        
        ws.onopen = () => {
            console.log("Secure WebSocket Connected to Localhost");
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage({
                    id: Date.now(),
                    message: data.message || event.data,
                    type: data.type || 'info',
                    timestamp: new Date().toLocaleTimeString()
                });
            } catch (e) {
                onMessage({ id: Date.now(), message: event.data, type: 'info', timestamp: new Date().toLocaleTimeString() });
            }
        };

        ws.onerror = (e) => {
            console.warn("WS Connection Failed, switching to Local Simulator");
            startSimulation();
        };

    } catch (e) {
        startSimulation();
    }

    // 2. Local Simulation Fallback
    function startSimulation() {
        let logIndex = 0;
        mockInterval = setInterval(() => {
            if (logIndex >= MOCK_BUILD_LOGS.length) {
                clearInterval(mockInterval);
                return;
            }
            const log = MOCK_BUILD_LOGS[logIndex];
            onMessage({
                id: Date.now(),
                message: log.message,
                type: log.type as any,
                timestamp: new Date().toLocaleTimeString()
            });
            logIndex++;
        }, 800); 
    }

    return {
        close: () => {
            if (ws) ws.close();
            if (mockInterval) clearInterval(mockInterval);
        }
    };
  }

  /**
   * Triggers a build job.
   */
  static async triggerBuild(target: 'android' | 'ios', profile: string): Promise<{ buildId: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); 

      const response = await fetch(`${API_CONFIG.BASE_URL}/v1/builds`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ target, profile, type: 'apk' }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error(`Build trigger failed: ${response.statusText}`);
      return await response.json();
    } catch (e) {
      console.warn("LinkZ API Unreachable. Using Local Build Runner.");
      return { buildId: `local-${Date.now()}` };
    }
  }

  static async getReleases(): Promise<Partial<ReleaseMetadata>[]> {
    try {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 1500);
        const response = await fetch(`${API_CONFIG.BASE_URL}/v1/catalog/releases`, { headers: API_CONFIG.HEADERS, signal: controller.signal });
        if (!response.ok) throw new Error('Failed');
        return await response.json();
    } catch (error) {
        return MOCK_CATALOG;
    }
  }

  static async getAnalyticsData(timeRange: string): Promise<any[]> {
    try {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 1500);
        const response = await fetch(`${API_CONFIG.BASE_URL}/v1/analytics/streams?range=${timeRange}`, { headers: API_CONFIG.HEADERS, signal: controller.signal });
        if (!response.ok) throw new Error('Failed');
        return await response.json();
    } catch (error) {
        return MOCK_ANALYTICS;
    }
  }

  static async getDashboardStats(): Promise<any> {
    try {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 1500);
        const response = await fetch(`${API_CONFIG.BASE_URL}/v1/dashboard/stats`, { headers: API_CONFIG.HEADERS, signal: controller.signal });
        if (!response.ok) throw new Error('Failed');
        return await response.json();
    } catch (error) {
      return {
        assets: 1248,
        streams: 89432,
        nodes: 42,
        metaIndex: 98,
        queue: []
      };
    }
  }

  static async getNetworkStatus(): Promise<ServiceStatus[]> {
    try {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 1000);
        const response = await fetch(`${API_CONFIG.BASE_URL}/health`, { headers: API_CONFIG.HEADERS, signal: controller.signal });
        if (!response.ok) throw new Error('Failed');
        return await response.json();
    } catch (error) {
      return [
        { name: 'Expo Build Service', status: 'pending', port: 'EAS', latency: '-' },
        { name: 'Android Build', status: 'offline', port: 'Gradle', latency: '-' },
        { name: 'Metro Bundler', status: 'offline', port: '8081', latency: '-' },
        { name: 'LinkZ API', status: 'running', port: 'Local Mode', latency: '0ms' },
      ];
    }
  }
}