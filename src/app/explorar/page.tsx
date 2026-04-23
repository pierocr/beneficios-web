import type { Metadata } from "next"

import { PageShell } from "@/components/layout/page-shell"
import { ExploreView } from "@/components/sections/explore-view"

export const metadata: Metadata = {
  title: "Explorar beneficios",
  description:
    "Explora descuentos bancarios y fintech en Chile con filtros por categoría, banco, canal y medio de pago.",
}

export default async function ExplorarPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    day?: string
    bank?: string
    region?: string
    min?: string
  }>
}) {
  const params = await searchParams
  const minBenefitValue = params.min ? Number(params.min) : undefined

  return (
    <PageShell className="gap-6 py-8 md:py-10">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Exploración</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          Encuentra el mejor beneficio para cada compra
        </h1>
        <p className="max-w-3xl text-base leading-7 text-slate-600">
          Filtra por rubro, banco, canal y medio de pago para ver rápidamente qué opción conviene más.
        </p>
      </div>
      <ExploreView
        initialSearch={params.q || ""}
        initialDay={params.day}
        initialProviderSlug={params.bank}
        initialRegion={params.region}
        initialMinBenefitValue={
          Number.isFinite(minBenefitValue) ? minBenefitValue : undefined
        }
      />
    </PageShell>
  )
}
