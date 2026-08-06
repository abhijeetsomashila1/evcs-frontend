import type { Charger, ChargingSession } from '../types';

export const api = {
  // 1. Get All Chargers
  getChargers: async (): Promise<Charger[]> => {
    const res = await fetch('/api/station/all');
    if (!res.ok) throw new Error('Failed to fetch chargers');
    return res.json();
  },

  // 2. Get Charger Status
  getCharger: async (id: string): Promise<Charger> => {
    const res = await fetch(`/api/station/status?id=${id}`);
    if (!res.ok) throw new Error('Failed to fetch charger status');
    return res.json();
  },

  startCharging: async (userId: number, chargerId: string, amount: number): Promise<{ message: string, session_id: number }> => {
    const res = await fetch('/api/session/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, charger_id: chargerId, amount })
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to start charging');
    }
    return res.json();
  },

  // 4. Stop Charging
  stopCharging: async (sessionId: number): Promise<{ message: string }> => {
    const res = await fetch('/api/session/stop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId })
    });
    if (!res.ok) throw new Error('Failed to stop charging');
    return res.json();
  },

  // 5. Charging History
  getHistory: async (userId: number): Promise<ChargingSession[]> => {
    const res = await fetch(`/api/session/history?user_id=${userId}`);
    if (!res.ok) throw new Error('Failed to fetch history');
    return res.json();
  }
};
