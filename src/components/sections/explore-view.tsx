"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

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
import { CHANNEL_OPTIONS, DAY_OPTIONS, REGION_OPTIONS, SORT_OPTIONS } from "@/lib/constants"
import { useFiltersStore } from "@/stores/filters-store"

const BENEFITS_PAGE_SIZE = 36
const MAX_VISIBLE_BENEFITS = 240

export function ExploreView({
  initialSearch = "",
  initialDay,
  initialProviderSlug,
  initialRegion,
  initialMinBenefitValue,
}: {
  initialSearch?: string
  initialDay?: string
  initialProviderSlug?: string
  initialRegion?: string
  initialMinBenefitValue?: number
}) {
  const filters = useFiltersStore()
  const setSearch = useFiltersStore((state) => state.setSearch)
  const setDays = useFiltersStore((state) => state.setDays)
  const setProviderSlugs = useFiltersStore((state) => state.setProviderSlugs)
  const setRegion = useFiltersStore((state) => state.setRegion)
  const setMinBenefitValue = useFiltersStore((state) => state.setMinBenefitValue)
  const [pagination, setPagination] = useState({ page: 1, filtersSignature: "" })
  const handleSearchFiltersChange = useCallback(
    ({
      day,
      providerSlug,
      region,
      minBenefitValue,
    }: {
      day?: string
      providerSlug?: string
      region?: string
      minBenefitValue?: number
    }) => {
      setDays(day ? [day] : [])
      setProviderSlugs(providerSlug ? [providerSlug] : [])
      setRegion(region)
      setMinBenefitValue(minBenefitValue)
    },
    [setDays, setMinBenefitValue, setProviderSlugs, setRegion]
  )

  useEffect(() => {
    setSearch(initialSearch)
  }, [initialSearch, setSearch])

  useEffect(() => {
    setDays(initialDay ? [initialDay] : [])
  }, [initialDay, setDays])

  useEffect(() => {
    setProviderSlugs(initialProviderSlug ? [initialProviderSlug] : [])
  }, [initialProviderSlug, setProviderSlugs])

  useEffect(() => {
    setRegion(initialRegion)
  }, [initialRegion, setRegion])

  useEffect(() => {
    setMinBenefitValue(initialMinBenefitValue)
  }, [initialMinBenefitValue, setMinBenefitValue])

  const filtersSignature = useMemo(
    () =>
      JSON.stringify({
        search: filters.search,
        category: filters.category,
        providerSlugs: filters.providerSlugs,
        paymentTypes: filters.paymentTypes,
        channels: filters.channels,
        days: filters.days,
        region: filters.region,
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
      filters.region,
      filters.search,
      filters.sortBy,
      filters.todayOnly,
    ]
  )

  const page =
    pagination.filtersSignature === filtersSignature ? pagination.page : 1

  const params = useMemo(
    () => ({
      search: filters.search,
      category: filters.category,
      providerSlugs: filters.providerSlugs,
      paymentTypes: filters.paymentTypes,
      channels: filters.channels,
      days: filters.days,
      region: filters.region,
      minBenefitValue: filters.minBenefitValue,
      sortBy: filters.sortBy,
      todayOnly: filters.todayOnly,
      page: 1,
      limit: Math.min(page * BENEFITS_PAGE_SIZE, MAX_VISIBLE_BENEFITS),
    }),
    [
      filters.category,
      filters.channels,
      filters.days,
      filters.region,
      filters.minBenefitValue,
      filters.paymentTypes,
      filters.providerSlugs,
      filters.search,
      filters.sortBy,
      filters.todayOnly,
      page,
    ]
  )

  const { data, isFetching, isLoading } = useBenefits(params)
  const benefits = data?.items ?? []
  const totalBenefits = data?.total ?? benefits.length
  const hasMore = (data?.hasMore ?? false) && benefits.length < MAX_VISIBLE_BENEFITS
  const providerLabels = useMemo(
    () => new Map<string, string>(walletProviders.map((provider) => [provider.slug, provider.label])),
    []
  )
  const paymentLabels = useMemo(
    () => new Map<string, string>(walletCardTypes.map((type) => [type.value, type.label])),
    []
  )
  const channelLabels = useMemo(
    () => new Map<string, string>(CHANNEL_OPTIONS.map((channel) => [channel.value, channel.label])),
    []
  )
  const dayLabels = useMemo(
    () => new Map<string, string>(DAY_OPTIONS.map((day) => [day.value, day.label])),
    []
  )
  const regionLabels = useMemo(
    () => new Map<string, string>(REGION_OPTIONS.map((region) => [region.value, region.label])),
    []
  )
  const activeFilters = [
    filters.todayOnly ? "Hoy" : null,
    filters.minBenefitValue ? `Desde ${filters.minBenefitValue}%` : null,
    filters.category,
    ...filters.providerSlugs.map((provider) => providerLabels.get(provider) ?? provider),
    ...filters.paymentTypes.map((payment) => paymentLabels.get(payment) ?? payment),
    ...filters.channels.map((channel) => channelLabels.get(channel) ?? channel),
    ...filters.days.map((day) => dayLabels.get(day) ?? day),
    filters.region ? regionLabels.get(filters.region) ?? filters.region : null,
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
            defaultDay={initialDay}
            defaultProviderSlug={initialProviderSlug}
            defaultRegion={initialRegion}
            defaultMinBenefitValue={initialMinBenefitValue}
            onSearch={setSearch}
            onFiltersChange={handleSearchFiltersChange}
            placeholder="Busca supermercados, delivery, viajes o un comercio"
            showLiveResults
            showFilters
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
        ) : benefits.length === 0 ? (
          <BenefitEmptyState />
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
              <span>
                Mostrando {benefits.length} de {totalBenefits} beneficios
              </span>
              {isFetching && !isLoading ? <span>Actualizando...</span> : null}
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {benefits.map((benefit) => (
                <BenefitCard key={benefit.id} benefit={benefit} />
              ))}
            </div>
            {hasMore ? (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  className="rounded-full"
                  disabled={isFetching}
                  onClick={() =>
                    setPagination({
                      filtersSignature,
                      page: page + 1,
                    })
                  }
                >
                  {isFetching ? "Cargando..." : "Cargar más beneficios"}
                </Button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  )
}
