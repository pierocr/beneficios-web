import { CATEGORY_ORDER } from "@/lib/constants"
import { Benefit } from "@/types/benefit"

export function PopularCategoriesSection({ benefits }: { benefits: Benefit[] }) {
  const items = CATEGORY_ORDER.map((category) => {
    const matches = benefits.filter((benefit) => benefit.categoryName === category)
    const best = matches.sort((left, right) => right.benefitValue - left.benefitValue)[0]

    return {
      category,
      count: matches.length,
      bestValue: best
        ? `${best.benefitValue}${best.benefitValueUnit === "percentage" ? "%" : ""}`
        : "N/A",
    }
  }).filter((item) => item.count > 0)

  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Explora por rubro</p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
          Categorías populares
        </h2>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4">
        {items.map((item) => (
          <article
            key={item.category}
            className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{item.count} beneficios activos</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-950">{item.category}</h3>
            <p className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">
              {item.bestValue}
            </p>
            <p className="mt-1 text-sm text-slate-600">mejor señal visible hoy</p>
          </article>
        ))}
      </div>
    </section>
  )
}
