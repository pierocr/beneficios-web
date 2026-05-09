"use client"

import Link from "next/link"
import { ArrowRight, Navigation, Search, Sparkles } from "lucide-react"
import { useMemo, useRef, useState } from "react"

import { BenefitCard } from "@/components/benefits/benefit-card"
import { BenefitMedia } from "@/components/benefits/benefit-media"
import { BenefitSearchBar } from "@/components/search/benefit-search-bar"
import type { SearchBarFilters } from "@/components/search/benefit-search-bar"
import { Button } from "@/components/ui/button"
import { useBenefits } from "@/features/benefits/queries"
import {
  isBenefitAvailableToday,
  sortBenefitsByRelevance,
} from "@/features/benefits/ranking"
import { formatBenefitValue, getBenefitDetailHref } from "@/lib/formatters"
import { Benefit, BenefitSearchParams } from "@/types/benefit"

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function getTodayName() {
  return normalizeText(
    new Intl.DateTimeFormat("es-CL", {
      timeZone: "America/Santiago",
      weekday: "long",
    }).format(new Date())
  )
}

function isDailySignalCategory(benefit: Benefit) {
  const category = normalizeText(benefit.categoryName)

  return [
    "cafeteria",
    "comida rapida",
    "comida",
    "restaurante",
  ].some((keyword) => category.includes(keyword))
}

function isExactTodayBenefit(benefit: Benefit) {
  const todayName = getTodayName()

  return benefit.days.some((day) => normalizeText(day) === todayName)
}

function getDailySignalBenefit(benefits: Benefit[]) {
  const exactHighValueFood = benefits.filter(
    (benefit) =>
      isExactTodayBenefit(benefit) &&
      isDailySignalCategory(benefit) &&
      benefit.benefitValueUnit === "percentage" &&
      benefit.benefitValue >= 40
  )

  if (exactHighValueFood.length > 0) {
    return sortBenefitsByRelevance(exactHighValueFood)[0]
  }

  const availableToday = benefits.filter(isBenefitAvailableToday)
  if (availableToday.length > 0) {
    return sortBenefitsByRelevance(availableToday)[0]
  }

  return sortBenefitsByRelevance(benefits)[0]
}

export function HomeHero({ benefits }: { benefits: Benefit[] }) {
  const dailySignal = getDailySignalBenefit(benefits)
  const resultsRef = useRef<HTMLElement>(null)
  const [hasSubmittedSearch, setHasSubmittedSearch] = useState(false)
  const [submittedSearch, setSubmittedSearch] = useState("")
  const [submittedFilters, setSubmittedFilters] = useState<SearchBarFilters>({})
  const submittedSearchLabel = submittedSearch.trim()
  const searchParams = useMemo<BenefitSearchParams>(
    () => ({
      search: submittedSearchLabel,
      days: submittedFilters.day ? [submittedFilters.day] : undefined,
      providerSlugs: submittedFilters.providerSlug
        ? [submittedFilters.providerSlug]
        : undefined,
      region: submittedFilters.region,
      minBenefitValue: submittedFilters.minBenefitValue,
      page: 1,
      limit: 24,
    }),
    [submittedFilters, submittedSearchLabel]
  )
  const exploreHref = useMemo(() => {
    const params = new URLSearchParams()

    if (submittedSearchLabel) params.set("q", submittedSearchLabel)
    if (submittedFilters.day) params.set("day", submittedFilters.day)
    if (submittedFilters.providerSlug) {
      params.set("bank", submittedFilters.providerSlug)
    }
    if (submittedFilters.region) params.set("region", submittedFilters.region)
    if (submittedFilters.minBenefitValue != null) {
      params.set("min", String(submittedFilters.minBenefitValue))
    }

    const suffix = params.toString()
    return suffix ? `/explorar?${suffix}` : "/explorar"
  }, [submittedFilters, submittedSearchLabel])
  const { data, isFetching, isLoading } = useBenefits(searchParams, {
    enabled: hasSubmittedSearch,
  })
  const resultBenefits = data?.items ?? []
  const resultCount = data?.total ?? 0

  function handleSubmitSearch(value: string, filters: SearchBarFilters) {
    setSubmittedSearch(value.trim())
    setSubmittedFilters(filters)
    setHasSubmittedSearch(true)

    window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }

  return (
    <>
      <section className="relative z-30 grid gap-6 rounded-[28px] border border-slate-200/70 bg-white/90 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6 md:grid-cols-[1.02fr_0.98fr] md:rounded-[36px] md:p-8">
        <div className="min-w-0 space-y-6">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
            <Sparkles className="size-4" />
            <span className="truncate">Busca por comercio, día, banco y región</span>
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-6xl">
              Salir más, gastar menos.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              Luppa reúne descuentos, topes y condiciones para que encuentres rápido el mejor beneficio antes de comer, comprar o moverte por la ciudad.
            </p>
          </div>
          <div className="grid max-w-2xl gap-4 border-t border-slate-200 pt-4 text-sm text-slate-600 sm:grid-cols-3">
            <div>
              <p className="font-semibold text-slate-950">Busca con intención</p>
              <p className="mt-1 text-xs">Encuentra el descuento directo.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-950">Elige mejor</p>
              <p className="mt-1 text-xs">Filtra bancos y fintechs.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-950">Aprovecha cerca</p>
              <p className="mt-1 text-xs">Revisa opciones cercanas.</p>
            </div>
          </div>
        </div>

        {dailySignal ? (
          <Link
            href={getBenefitDetailHref(
              dailySignal.providerSlug,
              dailySignal.merchantSlug
            )}
            className="group relative min-h-[220px] min-w-0 overflow-hidden rounded-[30px] border border-emerald-100 bg-slate-950 text-white shadow-[0_26px_70px_rgba(15,23,42,0.2)] md:min-h-[240px]"
          >
            <BenefitMedia
              imageUrl={dailySignal.imageUrl}
              merchantName={dailySignal.merchantName}
              categoryName={dailySignal.categoryName}
              priority
              showLabel={false}
              className="absolute inset-0 size-full"
              imageClassName="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(15,23,42,0.92),_rgba(15,23,42,0.58)_52%,_rgba(6,78,59,0.26))]" />
            <div className="absolute top-4 left-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-800 shadow-sm">
              Señal del día
            </div>
            <div className="absolute right-5 bottom-5 left-5">
              <p className="text-5xl font-semibold tracking-tight md:text-6xl">
                {formatBenefitValue(dailySignal)}
              </p>
              <p className="mt-2 text-lg font-semibold md:text-xl">
                {dailySignal.merchantName} con {dailySignal.bankName}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
                Ver detalle
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ) : null}

        <div className="grid gap-3 md:col-span-2 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-stretch">
          <BenefitSearchBar
            onSubmitSearch={handleSubmitSearch}
            showLiveResults
            showFilters
            className="min-w-0"
            placeholder="Busca Avatar Sushi, Jumbo, PedidosYa o una categoría"
          />
          <Link
            href="/mapa"
            className="group flex h-full items-center justify-between gap-4 rounded-[28px] border border-emerald-200 bg-emerald-950 p-4 text-white shadow-[0_18px_50px_rgba(6,78,59,0.18)] transition hover:-translate-y-0.5 hover:bg-emerald-900"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-emerald-100">
              <Navigation className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-100">
                <Search className="size-4" />
                Buscar por mapa
              </div>
              <p className="mt-1 text-base font-semibold leading-5">
                Descubre descuentos cerca de ti
              </p>
            </div>
            <ArrowRight className="size-5 shrink-0 text-emerald-100 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {hasSubmittedSearch ? (
        <section ref={resultsRef} className="scroll-mt-24 space-y-5">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Resultados
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                {submittedSearchLabel
                  ? `Beneficios para "${submittedSearchLabel}"`
                  : "Beneficios encontrados"}
              </h2>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              {isFetching ? <span>Actualizando...</span> : null}
              {!isLoading ? <span>{resultCount} resultados</span> : null}
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-sm text-slate-500">
              Cargando beneficios...
            </div>
          ) : resultBenefits.length === 0 ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-8">
              <p className="text-lg font-semibold text-slate-950">
                No encontramos beneficios con esos filtros.
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Prueba con otro comercio, banco o un descuento menor.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3">
                {resultBenefits.map((benefit) => (
                  <BenefitCard key={benefit.id} benefit={benefit} variant="compact" />
                ))}
              </div>
              {resultCount > resultBenefits.length ? (
                <div className="flex justify-center">
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href={exploreHref}>Ver más en explorar</Link>
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </section>
      ) : null}
    </>
  )
}
