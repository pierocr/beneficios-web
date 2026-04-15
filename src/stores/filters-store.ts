"use client"

import { create } from "zustand"

import { Benefit, BenefitSearchParams } from "@/types/benefit"

type FiltersState = BenefitSearchParams & {
  channels: Array<Benefit["channel"]>
  providerSlugs: string[]
  paymentTypes: string[]
  setSearch: (search: string) => void
  setCategory: (category?: string) => void
  setSortBy: (sortBy: NonNullable<BenefitSearchParams["sortBy"]>) => void
  toggleProvider: (providerSlug: string) => void
  togglePaymentType: (paymentType: string) => void
  toggleChannel: (channel: Benefit["channel"]) => void
  setTodayOnly: (enabled: boolean) => void
  reset: () => void
}

const initialState = {
  search: "",
  category: undefined,
  providerSlugs: [] as string[],
  paymentTypes: [] as string[],
  channels: [] as Array<Benefit["channel"]>,
  sortBy: "best" as const,
  todayOnly: false,
}

export const useFiltersStore = create<FiltersState>((set) => ({
  ...initialState,
  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  setSortBy: (sortBy) => set({ sortBy }),
  toggleProvider: (providerSlug) =>
    set((state) => ({
      providerSlugs: state.providerSlugs.includes(providerSlug)
        ? state.providerSlugs.filter((value) => value !== providerSlug)
        : [...state.providerSlugs, providerSlug],
    })),
  togglePaymentType: (paymentType) =>
    set((state) => ({
      paymentTypes: state.paymentTypes.includes(paymentType)
        ? state.paymentTypes.filter((value) => value !== paymentType)
        : [...state.paymentTypes, paymentType],
    })),
  toggleChannel: (channel) =>
    set((state) => ({
      channels: state.channels.includes(channel)
        ? state.channels.filter((value) => value !== channel)
        : [...state.channels, channel],
    })),
  setTodayOnly: (todayOnly) => set({ todayOnly }),
  reset: () => set(initialState),
}))
