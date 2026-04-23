import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { BenefitMedia } from "@/components/benefits/benefit-media"
import { BenefitSearchBar } from "@/components/search/benefit-search-bar"
import {
  isBenefitAvailableToday,
  sortBenefitsByRelevance,
} from "@/features/benefits/ranking"
import { formatBenefitValue, getBenefitDetailHref } from "@/lib/formatters"
import { Benefit } from "@/types/benefit"

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

  return (
    <section className="grid gap-6 rounded-[28px] border border-slate-200/70 bg-white/85 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6 md:grid-cols-[1.06fr_0.94fr] md:rounded-[36px] md:p-8">
      <div className="min-w-0 space-y-5">
        <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
          <Sparkles className="size-4" />
          <span className="truncate">Busca por comercio, día, banco y región</span>
        </div>
        <div className="space-y-4">
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-6xl">
            Encuentra qué tarjeta te conviene usar hoy.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Compara descuentos, topes y condiciones con una búsqueda más precisa. Elige día, tipo de tarjeta y región para llegar rápido al beneficio correcto.
          </p>
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

      <BenefitSearchBar
        redirectTo="/explorar"
        showLiveResults
        showFilters
        className="min-w-0 md:col-span-2"
        placeholder="Busca Avatar Sushi, Jumbo, PedidosYa o una categoría"
      />
    </section>
  )
}
