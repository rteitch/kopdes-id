"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "KETUA" | "BENDAHARA" | "PENGURUS" | "ANGGOTA" | "DINAS";

interface UserProfile {
  id: string;
  nama: string;
  noHp: string;
  role: UserRole;
  koperasiId: string;
  koperasiNama: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user: UserProfile) =>
        set({ user, isAuthenticated: true, isLoading: false }),
      logout: () =>
        set({ user: null, isAuthenticated: false, isLoading: false }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
    }),
    {
      name: "kopdes-auth",
    }
  )
);