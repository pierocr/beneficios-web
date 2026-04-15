import { Benefit } from "@/types/benefit"

export function ProvidersSection({ benefits }: { benefits: Benefit[] }) {
  const providers = Array.from(
    new Map(
      benefits.map((benefit) => [
        benefit.providerSlug,
        { slug: benefit.providerSlug, name: benefit.bankName },
      ])
    ).values()
  )

  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
          Ecosistema cubierto
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
          Bancos y fintechs disponibles
        </h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {providers.map((provider, index) => (
          <div
            key={provider.slug}
            className="rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">Proveedor #{index + 1}</p>
            <p className="mt-2 text-lg font-semibold text-slate-950">{provider.name}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
