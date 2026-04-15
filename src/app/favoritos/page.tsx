import type { Metadata } from "next"

import { BenefitCard } from "@/components/benefits/benefit-card"
import { BenefitEmptyState } from "@/components/benefits/benefit-empty-state"
import { PageShell } from "@/components/layout/page-shell"
import { mockBenefits } from "@/features/benefits/mock-data"

export const metadata: Metadata = {
  title: "Favoritos",
  description:
    "Guarda tus comercios y beneficios frecuentes para revisarlos rápido cuando los necesites.",
}

export default function FavoritosPage() {
  const mockFavorites = mockBenefits.slice(0, 2)

  return (
    <PageShell className="gap-8 py-8 md:py-10">
      <section className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Acceso rápido</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          Tus favoritos
        </h1>
        <p className="max-w-3xl text-base leading-7 text-slate-600">
          Aquí podrás guardar comercios frecuentes y beneficios que revisas seguido para compararlos más rápido.
        </p>
      </section>

      <BenefitEmptyState
        title="Todavía no guardas beneficios"
        description="Cuando empieces a guardar comercios o promociones frecuentes, aparecerán aquí para tenerlas a mano."
      />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">
          Demo visual de favoritos sugeridos
        </h2>
        <div className="grid gap-4 xl:grid-cols-2">
          {mockFavorites.map((benefit) => (
            <BenefitCard key={benefit.id} benefit={benefit} />
          ))}
        </div>
      </section>
    </PageShell>
  )
}
