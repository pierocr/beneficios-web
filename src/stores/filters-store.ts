"use client"

import { create } from "zustand"

import { Benefit, BenefitSearchParams } from "@/types/benefit"

type FiltersState = BenefitSearchParams & {
  channels: Array<Benefit["channel"]>
  providerSlugs: string[]
  paymentTypes: string[]
  days: string[]
  setSearch: (search: string) => void
  setCategory: (category?: string) => void
  setSortBy: (sortBy: NonNullable<BenefitSearchParams["sortBy"]>) => void
  toggleProvider: (providerSlug: string) => void
  togglePaymentType: (paymentType: string) => void
  toggleChannel: (channel: Benefit["channel"]) => void
  toggleDay: (day: string) => void
  setMinBenefitValue: (minBenefitValue?: number) => void
  setTodayOnly: (enabled: boolean) => void
  reset: () => void
}

const initialState = {
  search: "",
  category: undefined,
  providerSlugs: [] as string[],
  paymentTypes: [] as string[],
  channels: [] as Array<Benefit["channel"]>,
  days: [] as string[],
  minBenefitValue: undefined,
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
  toggleDay: (day) =>
    set((state) => ({
      days: state.days.includes(day)
        ? state.days.filter((value) => value !== day)
        : [...state.days, day],
    })),
  setMinBenefitValue: (minBenefitValue) => set({ minBenefitValue }),
  setTodayOnly: (todayOnly) => set({ todayOnly }),
  reset: () => set(initialState),
}))
