"use client"

import { useEffect, useMemo } from "react"

import { BenefitCard } from "@/components/benefits/benefit-card"
import { BenefitEmptyState } from "@/components/benefits/benefit-empty-state"
import { FilterChip } from "@/components/filters/filter-chip"
import { FiltersSidebar } from "@/components/filters/filters-sidebar"
import { MobileFiltersDrawer } from "@/components/filters/mobile-filters-drawer"
import { BenefitSearchBar } from "@/components/search/benefit-search-bar"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useBenefits } from "@/features/benefits/queries"
import { walletCardTypes, walletProviders } from "@/features/wallet/wallet-options"
import { CHANNEL_OPTIONS, DAY_OPTIONS, SORT_OPTIONS } from "@/lib/constants"
import { useFiltersStore } from "@/stores/filters-store"

export function ExploreView({ initialSearch = "" }: { initialSearch?: string }) {
  const filters = useFiltersStore()
  const setSearch = useFiltersStore((state) => state.setSearch)

  useEffect(() => {
    setSearch(initialSearch)
  }, [initialSearch, setSearch])

  const params = useMemo(
    () => ({
      search: filters.search,
      category: filters.category,
      providerSlugs: filters.providerSlugs,
      paymentTypes: filters.paymentTypes,
      channels: filters.channels,
      days: filters.days,
      minBenefitValue: filters.minBenefitValue,
      sortBy: filters.sortBy,
      todayOnly: filters.todayOnly,
    }),
    [
      filters.category,
      filters.channels,
      filters.days,
      filters.minBenefitValue,
      filters.paymentTypes,
      filters.providerSlugs,
      filters.search,
      filters.sortBy,
      filters.todayOnly,
    ]
  )

  const { data = [], isLoading } = useBenefits(params)
  const providerLabels = new Map<string, string>(
    walletProviders.map((provider) => [provider.slug, provider.label])
  )
  const paymentLabels = new Map<string, string>(
    walletCardTypes.map((type) => [type.value, type.label])
  )
  const channelLabels = new Map<string, string>(
    CHANNEL_OPTIONS.map((channel) => [channel.value, channel.label])
  )
  const dayLabels = new Map<string, string>(
    DAY_OPTIONS.map((day) => [day.value, day.label])
  )
  const activeFilters = [
    filters.todayOnly ? "Hoy" : null,
    filters.minBenefitValue ? `Desde ${filters.minBenefitValue}%` : null,
    filters.category,
    ...filters.providerSlugs.map((provider) => providerLabels.get(provider) ?? provider),
    ...filters.paymentTypes.map((payment) => paymentLabels.get(payment) ?? payment),
    ...filters.channels.map((channel) => channelLabels.get(channel) ?? channel),
    ...filters.days.map((day) => dayLabels.get(day) ?? day),
  ].filter(Boolean) as string[]

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="hidden lg:block">
        <FiltersSidebar />
      </aside>

      <section className="space-y-5">
        <div className="sticky top-20 z-20 space-y-4 rounded-[30px] border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur">
          <BenefitSearchBar
            defaultValue={initialSearch}
            onSearch={setSearch}
            placeholder="Busca supermercados, delivery, viajes o un comercio"
            showLiveResults
          />

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={filters.todayOnly ? "default" : "outline"}
              className="rounded-full"
              onClick={() => filters.setTodayOnly(!filters.todayOnly)}
            >
              Hoy
            </Button>
            <MobileFiltersDrawer />
            <div className="ml-auto min-w-48">
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  filters.setSortBy(value as "best" | "discount" | "ending")
                }
              >
                <SelectTrigger className="rounded-full">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <FilterChip key={filter} label={filter} active />
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-sm text-slate-500">
            Cargando beneficios...
          </div>
        ) : data.length === 0 ? (
          <BenefitEmptyState />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {data.map((benefit) => (
              <BenefitCard key={benefit.id} benefit={benefit} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
