"use client"

import { useMemo, useState } from "react"

import { BenefitRankingCard } from "@/components/benefits/benefit-ranking-card"
import { BenefitSearchBar } from "@/components/search/benefit-search-bar"
import { useBenefits } from "@/features/benefits/queries"
import { rankBenefitsForComparison } from "@/features/compare"

export function CompareView({ initialSearch = "" }: { initialSearch?: string }) {
  const [search, setSearch] = useState(initialSearch)
  const { data = [] } = useBenefits()
  const ranked = useMemo(
    () => rankBenefitsForComparison(data, search || initialSearch),
    [data, initialSearch, search]
  )

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Ranking comparativo</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            Compara qué banco conviene más
          </h1>
          <p className="text-base leading-7 text-slate-600">
            Busca un comercio o categoría y compara descuento, tope, medio de pago, canal y confianza sin caer en una tabla incómoda en mobile.
          </p>
        </div>
        <BenefitSearchBar
          defaultValue={initialSearch}
          onSearch={setSearch}
          placeholder="Ejemplo: Jumbo, delivery, viajes o farmacias"
          className="mt-5"
        />
      </div>

      <div className="grid gap-4">
        {ranked.slice(0, 8).map((benefit, index) => (
          <BenefitRankingCard key={benefit.id} benefit={benefit} rank={index + 1} />
        ))}
      </div>
    </div>
  )
}
