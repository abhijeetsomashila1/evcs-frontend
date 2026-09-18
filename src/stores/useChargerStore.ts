import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChargerState {
  selectedChargerId: string | null;
  currentSessionId: number | null;
  sessionStartTime: number | null;
  chargingAmount: number | null;
  setSelectedCharger: (id: string | null) => void;
  setCurrentSession: (id: number | null, startTime?: number, amount?: number) => void;
  clearSelection: () => void;
}

export const useChargerStore = create<ChargerState>()(
  persist(
    (set) => ({
      selectedChargerId: null,
      currentSessionId: null,
      sessionStartTime: null,
      chargingAmount: null,
      setSelectedCharger: (id) => set({ selectedChargerId: id }),
      setCurrentSession: (id, startTime, amount) => 
        set({ currentSessionId: id, sessionStartTime: startTime ?? null, chargingAmount: amount ?? null }),
      clearSelection: () => set({ selectedChargerId: null, currentSessionId: null, sessionStartTime: null, chargingAmount: null }),
    }),
    {
      name: 'ev-charger-storage',
    }
  )
);
