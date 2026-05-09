"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { BadgePercent, Building2, CalendarDays, MapPin, Search } from "lucide-react"

import { BenefitMedia } from "@/components/benefits/benefit-media"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { searchBenefits } from "@/features/benefits/api"
import { walletProviders } from "@/features/wallet/wallet-options"
import { formatBenefitValue, formatCurrencyCLP, getBenefitDetailHref } from "@/lib/formatters"
import { DAY_OPTIONS, REGION_OPTIONS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Benefit, BenefitSearchParams } from "@/types/benefit"

export type SearchBarFilters = {
  day?: string
  providerSlug?: string
  region?: string
  minBenefitValue?: number
}

type BenefitSearchBarProps = {
  defaultValue?: string
  defaultDay?: string
  defaultProviderSlug?: string
  defaultRegion?: string
  defaultMinBenefitValue?: number
  placeholder?: string
  redirectTo?: string
  onSearch?: (value: string) => void
  onSubmitSearch?: (value: string, filters: SearchBarFilters) => void
  onFiltersChange?: (filters: SearchBarFilters) => void
  className?: string
  showLiveResults?: boolean
  showFilters?: boolean
  debounceMs?: number
}

export function BenefitSearchBar({
  defaultValue = "",
  defaultDay,
  defaultProviderSlug,
  defaultRegion,
  defaultMinBenefitValue,
  placeholder = "Busca por comercio, banco o categoría",
  redirectTo,
  onSearch,
  onSubmitSearch,
  onFiltersChange,
  className,
  showLiveResults = false,
  showFilters = false,
  debounceMs = 250,
}: BenefitSearchBarProps) {
  const [value, setValue] = useState(defaultValue)
  const [day, setDay] = useState(defaultDay ?? "any")
  const [providerSlug, setProviderSlug] = useState(defaultProviderSlug ?? "any")
  const [region, setRegion] = useState(defaultRegion ?? "any")
  const [minBenefitValue, setMinBenefitValue] = useState(
    defaultMinBenefitValue != null ? String(defaultMinBenefitValue) : "any"
  )
  const [results, setResults] = useState<Benefit[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const [isLoadingResults, setIsLoadingResults] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceMsRef = useRef(debounceMs)
  const router = useRouter()
  const trimmedValue = value.trim()
  const shouldShowResults = showLiveResults && isFocused && trimmedValue.length >= 2
  const searchParams: BenefitSearchParams = useMemo(
    () => ({
      search: trimmedValue,
      days: day !== "any" ? [day] : undefined,
      providerSlugs: providerSlug !== "any" ? [providerSlug] : undefined,
      region: region !== "any" ? region : undefined,
      minBenefitValue:
        minBenefitValue !== "any" ? Number(minBenefitValue) : undefined,
    }),
    [day, minBenefitValue, providerSlug, region, trimmedValue]
  )

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const filters = {
      day: day !== "any" ? day : undefined,
      providerSlug: providerSlug !== "any" ? providerSlug : undefined,
      region: region !== "any" ? region : undefined,
      minBenefitValue:
        minBenefitValue !== "any" ? Number(minBenefitValue) : undefined,
    }

    onSearch?.(value)
    onFiltersChange?.(filters)
    onSubmitSearch?.(value, filters)
    setIsFocused(false)

    if (redirectTo) {
      const params = new URLSearchParams()

      if (value.trim()) params.set("q", value.trim())
      if (day !== "any") params.set("day", day)
      if (providerSlug !== "any") params.set("bank", providerSlug)
      if (region !== "any") params.set("region", region)
      if (minBenefitValue !== "any") params.set("min", minBenefitValue)

      const suffix = params.toString()
      const url = suffix ? `${redirectTo}?${suffix}` : redirectTo
      router.push(url)
    }
  }

  useEffect(() => {
    debounceMsRef.current = debounceMs
  }, [debounceMs])

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    setDay(defaultDay ?? "any")
  }, [defaultDay])

  useEffect(() => {
    setProviderSlug(defaultProviderSlug ?? "any")
  }, [defaultProviderSlug])

  useEffect(() => {
    setRegion(defaultRegion ?? "any")
  }, [defaultRegion])

  useEffect(() => {
    setMinBenefitValue(
      defaultMinBenefitValue != null ? String(defaultMinBenefitValue) : "any"
    )
  }, [defaultMinBenefitValue])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onSearch?.(trimmedValue)
      onFiltersChange?.({
        day: day !== "any" ? day : undefined,
        providerSlug: providerSlug !== "any" ? providerSlug : undefined,
        region: region !== "any" ? region : undefined,
        minBenefitValue:
          minBenefitValue !== "any" ? Number(minBenefitValue) : undefined,
      })
    }, debounceMsRef.current)

    return () => window.clearTimeout(timeout)
  }, [
    day,
    debounceMs,
    minBenefitValue,
    onFiltersChange,
    onSearch,
    providerSlug,
    region,
    trimmedValue,
  ])

  useEffect(() => {
    if (!showLiveResults || trimmedValue.length < 2) {
      setResults([])
      setIsLoadingResults(false)
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(() => {
      setIsLoadingResults(true)
      searchBenefits({ ...searchParams, page: 1, limit: 6 }, { signal: controller.signal })
        .then((result) => {
          setResults(result.items.slice(0, 6))
        })
        .catch(() => {
          if (!controller.signal.aborted) setResults([])
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsLoadingResults(false)
        })
    }, debounceMsRef.current)

    setIsLoadingResults(true)

    return () => {
      controller.abort()
      window.clearTimeout(timeout)
    }
  }, [searchParams, showLiveResults, trimmedValue])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)

    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [])

  const liveResultsContent = useMemo(() => {
    if (!shouldShowResults) return null

    return (
      <div className="absolute top-[calc(100%+0.5rem)] right-0 left-0 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
        {isLoadingResults ? (
          <div className="px-4 py-3 text-sm text-slate-500">Buscando...</div>
        ) : results.length === 0 ? (
          <div className="px-4 py-3 text-sm text-slate-500">Sin resultados para esa busqueda.</div>
        ) : (
          <div className="max-h-96 overflow-y-auto py-2">
            {results.map((benefit) => (
              <Link
                key={benefit.id}
                href={getBenefitDetailHref(benefit.providerSlug, benefit.merchantSlug)}
                className="grid grid-cols-[64px_1fr] gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                onClick={() => setIsFocused(false)}
              >
                <BenefitMedia
                  imageUrl={benefit.imageUrl}
                  merchantName={benefit.merchantName}
                  showLabel={false}
                  className="h-16 rounded-xl"
                />
                <div className="grid min-w-0 gap-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">
                        {benefit.merchantName}
                      </p>
                      <p className="truncate text-xs text-slate-500">{benefit.bankName}</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-slate-950">
                      {formatBenefitValue(benefit)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span>{benefit.days.join(", ")}</span>
                    {benefit.capAmount != null && (
                      <span>Tope {formatCurrencyCLP(benefit.capAmount)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }, [isLoadingResults, results, shouldShowResults])

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form
        onSubmit={handleSubmit}
        className="grid gap-2 rounded-[28px] border border-slate-200 bg-white p-2 shadow-sm focus-within:border-slate-400"
        role="search"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex w-full min-w-0 flex-1 items-center gap-3 rounded-[22px] bg-slate-100 px-4 py-3">
            <Search className="size-4 shrink-0 text-slate-500" />
            <Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder={placeholder}
              aria-label={placeholder}
              className="h-5 border-0 bg-transparent px-0 py-0 text-[15px] leading-5 font-medium text-slate-950 caret-slate-950 shadow-none placeholder:text-slate-600 focus-visible:ring-0"
            />
          </div>
          <Button
            type="submit"
            className="h-11 w-full rounded-[22px] bg-slate-950 px-5 text-white hover:bg-slate-800 sm:w-auto"
          >
            Buscar
          </Button>
        </div>
        {showFilters ? (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger className="h-11 w-full rounded-[20px] border-slate-200 bg-white px-3">
                <CalendarDays className="size-4 text-slate-500" />
                <SelectValue placeholder="Día" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Cualquier día</SelectItem>
                {DAY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={providerSlug} onValueChange={setProviderSlug}>
              <SelectTrigger className="h-11 w-full rounded-[20px] border-slate-200 bg-white px-3">
                <Building2 className="size-4 text-slate-500" />
                <SelectValue placeholder="Banco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Cualquier banco</SelectItem>
                {walletProviders.map((option) => (
                  <SelectItem key={option.slug} value={option.slug}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={minBenefitValue} onValueChange={setMinBenefitValue}>
              <SelectTrigger className="h-11 w-full rounded-[20px] border-slate-200 bg-white px-3">
                <BadgePercent className="size-4 text-slate-500" />
                <SelectValue placeholder="Descuento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Cualquier descuento</SelectItem>
                <SelectItem value="10">Desde 10%</SelectItem>
                <SelectItem value="20">Desde 20%</SelectItem>
                <SelectItem value="30">Desde 30%</SelectItem>
                <SelectItem value="40">Desde 40%</SelectItem>
                <SelectItem value="50">Desde 50%</SelectItem>
              </SelectContent>
            </Select>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="h-11 w-full rounded-[20px] border-slate-200 bg-white px-3">
                <MapPin className="size-4 text-slate-500" />
                <SelectValue placeholder="Región" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Cualquier región</SelectItem>
                {REGION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </form>
      {liveResultsContent}
    </div>
  )
}
