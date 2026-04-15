import { BenefitCard } from "@/components/benefits/benefit-card"
import { Benefit } from "@/types/benefit"

export function TodayBenefitsSection({ benefits }: { benefits: Benefit[] }) {
  const featured = benefits.slice(0, 4)

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Ranking rápido
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
            Mejores beneficios de hoy
          </h2>
        </div>
        <p className="max-w-md text-sm text-slate-500">
          Priorizados por ahorro visible, confianza de la fuente y claridad de condiciones.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {featured.map((benefit) => (
          <BenefitCard key={benefit.id} benefit={benefit} />
        ))}
      </div>
    </section>
  )
}
