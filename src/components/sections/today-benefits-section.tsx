import { BenefitCard } from "@/components/benefits/benefit-card"
import {
  isBenefitAvailableToday,
  sortBenefitsByRelevance,
} from "@/features/benefits/ranking"
import { Benefit } from "@/types/benefit"

export function TodayBenefitsSection({ benefits }: { benefits: Benefit[] }) {
  const featured = sortBenefitsByRelevance(
    benefits.filter(isBenefitAvailableToday)
  ).slice(0, 15)

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Ranking rápido
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
            Mejores beneficios de hoy
          </h2>
        </div>
        <p className="max-w-md text-sm text-slate-500">
          Solo descuentos vigentes hoy, priorizados por consumo masivo, comida rápida y ahorro visible.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {featured.map((benefit) => (
          <BenefitCard key={benefit.id} benefit={benefit} variant="compact" />
        ))}
      </div>
    </section>
  )
}
