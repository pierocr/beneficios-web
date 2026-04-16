import { Sparkles } from "lucide-react"

import { FilterChip } from "@/components/filters/filter-chip"
import { BenefitSearchBar } from "@/components/search/benefit-search-bar"
import { QUICK_FILTERS } from "@/lib/constants"

export function HomeHero() {
  return (
    <section className="grid gap-6 rounded-[28px] border border-slate-200/70 bg-white/85 p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6 md:grid-cols-[1.1fr_0.9fr] md:rounded-[36px] md:p-8">
      <div className="min-w-0 space-y-5">
        <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
          <Sparkles className="size-4" />
          <span className="truncate">Señales claras, topes visibles y fuentes originales</span>
        </div>
        <div className="space-y-4">
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-6xl">
            Encuentra qué tarjeta te conviene usar hoy.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Compara descuentos, topes, días, bancos, fintechs y condiciones antes de pagar. La idea es simple: decidir rápido y con menos letra chica.
          </p>
        </div>
        <BenefitSearchBar redirectTo="/explorar" showLiveResults className="max-w-2xl" />
        <div className="flex flex-wrap gap-2">
          {QUICK_FILTERS.map((filter) => (
            <FilterChip key={filter} label={filter} />
          ))}
        </div>
      </div>

      <div className="grid min-w-0 gap-4">
        <div className="rounded-[30px] bg-[linear-gradient(180deg,_rgba(15,23,42,1),_rgba(30,41,59,0.96)_55%,_rgba(6,78,59,0.94)_100%)] p-6 text-white shadow-[0_26px_60px_rgba(15,23,42,0.18)]">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Señal del día</p>
          <p className="mt-4 text-4xl font-semibold tracking-tight">30%</p>
          <p className="mt-2 text-lg font-medium">Avatar Sushi con Santander</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Visible, simple y con tope mensual claro. Una tarjeta correcta cambia mucho el ahorro efectivo.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Cobertura actual</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">8</p>
            <p className="mt-1 text-sm text-slate-600">bancos y fintechs normalizados</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Foco UX</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">0 letra chica</p>
            <p className="mt-1 text-sm text-slate-600">sin esconder tope, canal ni medio de pago</p>
          </div>
        </div>
      </div>
    </section>
  )
}
