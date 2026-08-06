export interface Charger {
  charger_id: string;
  wisun_id: string;
  location: string;
  latitude: number;
  longitude: number;
  status: 'AVAILABLE' | 'CHARGING' | 'FAULT' | 'OFFLINE';
}

export interface User {
  user_id: number;
  name: string;
  email: string;
}

export interface ChargingSession {
  session_id: number;
  charger_id: string;
  user_id: number;
  start_time: string;
  end_time: string | null;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
}

export interface Telemetry {
  voltage: number;
  current: number;
  power: number;
  energy: number;
  temperature: number;
  signal_strength: number;
}
