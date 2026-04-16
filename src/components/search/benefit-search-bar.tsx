"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { Search } from "lucide-react"

import { BenefitMedia } from "@/components/benefits/benefit-media"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { searchBenefits } from "@/features/benefits/api"
import { formatBenefitValue, formatCurrencyCLP, getBenefitDetailHref } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import { Benefit } from "@/types/benefit"

type BenefitSearchBarProps = {
  defaultValue?: string
  placeholder?: string
  redirectTo?: string
  onSearch?: (value: string) => void
  className?: string
  showLiveResults?: boolean
  debounceMs?: number
}

export function BenefitSearchBar({
  defaultValue = "",
  placeholder = "Busca por comercio, banco o categoría",
  redirectTo,
  onSearch,
  className,
  showLiveResults = false,
  debounceMs = 250,
}: BenefitSearchBarProps) {
  const [value, setValue] = useState(defaultValue)
  const [results, setResults] = useState<Benefit[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const [isLoadingResults, setIsLoadingResults] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const trimmedValue = value.trim()
  const shouldShowResults = showLiveResults && isFocused && trimmedValue.length >= 2

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    onSearch?.(value)

    if (redirectTo) {
      const url = value
        ? `${redirectTo}?q=${encodeURIComponent(value)}`
        : redirectTo
      router.push(url)
    }
  }

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onSearch?.(trimmedValue)
    }, debounceMs)

    return () => window.clearTimeout(timeout)
  }, [debounceMs, onSearch, trimmedValue])

  useEffect(() => {
    if (!showLiveResults || trimmedValue.length < 2) {
      setResults([])
      setIsLoadingResults(false)
      return
    }

    let ignore = false

    setIsLoadingResults(true)
    searchBenefits({ search: trimmedValue })
      .then((items) => {
        if (!ignore) setResults(items.slice(0, 6))
      })
      .catch(() => {
        if (!ignore) setResults([])
      })
      .finally(() => {
        if (!ignore) setIsLoadingResults(false)
      })

    return () => {
      ignore = true
    }
  }, [showLiveResults, trimmedValue])

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
      <div className="absolute top-[calc(100%+0.5rem)] right-0 left-0 z-30 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
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
        className="flex flex-col gap-2 rounded-[28px] border border-slate-200 bg-white p-2 focus-within:border-slate-400 sm:flex-row sm:items-center"
        role="search"
      >
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
      </form>
      {liveResultsContent}
    </div>
  )
}
