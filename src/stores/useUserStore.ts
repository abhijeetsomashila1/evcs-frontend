import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface UserState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Mocked user for now
      currentUser: { user_id: 1, name: 'Admin', email: 'admin@scrc.in' },
      setCurrentUser: (user) => set({ currentUser: user }),
    }),
    {
      name: 'user-storage',
    }
  )
);
