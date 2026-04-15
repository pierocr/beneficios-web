"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type WalletState = {
  selectedProviders: string[]
  selectedCardTypes: string[]
  setWallet: (payload: {
    selectedProviders: string[]
    selectedCardTypes: string[]
  }) => void
  reset: () => void
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      selectedProviders: [],
      selectedCardTypes: ["Crédito"],
      setWallet: ({ selectedProviders, selectedCardTypes }) =>
        set({ selectedProviders, selectedCardTypes }),
      reset: () => set({ selectedProviders: [], selectedCardTypes: ["Crédito"] }),
    }),
    {
      name: "wallet-preferences",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
