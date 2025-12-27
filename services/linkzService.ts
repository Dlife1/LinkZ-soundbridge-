import { ReleaseMetadata, LogEntry, ServiceStatus, TrackData } from '../types';

const API_CONFIG = {
  BASE_URL: 'https://api.linkz.io',
  WS_URL: 'wss://api.linkz.io/ws',
  // Authorization implied from the PDF's context "studio-156266" or similar project ID
  HEADERS: {
    'Content-Type': 'application/json',
    'X-Project-ID': 'studio-156266',
    'Authorization': 'Bearer studio-156266-key' 
  }
};

export class LinkZService {
  // Real-time Build Log Streaming
  static connectBuildStream(buildId: string, onMessage: (log: LogEntry) => void, onError: () => void): WebSocket {
    const ws = new WebSocket(`${API_CONFIG.WS_URL}/builds/${buildId}/logs`);
    
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
        onMessage({
          id: Date.now(),
          message: event.data,
          type: 'info',
          timestamp: new Date().toLocaleTimeString()
        });
      }
    };

    ws.onerror = (e) => {
      console.error('Build Stream Error:', e);
      onError();
    };

    return ws;
  }

  // Trigger Mobile Build (APK)
  static async triggerBuild(target: 'android' | 'ios', profile: string): Promise<{ buildId: string }> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/v1/builds`, {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify({ target, profile, type: 'apk' })
    });
    
    if (!response.ok) throw new Error(`Build trigger failed: ${response.statusText}`);
    return await response.json();
  }

  // Fetch Catalog
  static async getReleases(): Promise<Partial<ReleaseMetadata>[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/v1/catalog/releases`, {
        headers: API_CONFIG.HEADERS
      });
      if (!response.ok) throw new Error('Failed to fetch catalog');
      return await response.json();
    } catch (error) {
      console.warn("API Unreachable, returning empty state", error);
      return []; 
    }
  }

  // Fetch Analytics
  static async getAnalyticsData(timeRange: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/v1/analytics/streams?range=${timeRange}`, {
        headers: API_CONFIG.HEADERS
      });
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return await response.json();
    } catch (error) {
      return [];
    }
  }

  // Fetch Dashboard Stats
  static async getDashboardStats(): Promise<any> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/v1/dashboard/stats`, {
        headers: API_CONFIG.HEADERS
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      // Return zeroed structure if API fails
      return {
        assets: 0,
        streams: 0,
        nodes: 0,
        metaIndex: 0,
        queue: []
      };
    }
  }

  // Check Node Status
  static async getNetworkStatus(): Promise<ServiceStatus[]> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
        headers: API_CONFIG.HEADERS
      });
      if (!response.ok) throw new Error('Network check failed');
      return await response.json();
    } catch (error) {
      return [
        { name: 'LinkZ API', status: 'error', port: '443', latency: '-' },
        { name: 'Expo Build Service', status: 'offline', port: 'EAS', latency: '-' },
      ];
    }
  }
}