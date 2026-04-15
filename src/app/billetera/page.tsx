import type { Metadata } from "next"

import { PageShell } from "@/components/layout/page-shell"
import { WalletPreferencesPanel } from "@/components/sections/wallet-preferences-panel"

export const metadata: Metadata = {
  title: "Mi billetera",
  description:
    "Personaliza tus bancos, fintechs y tipos de tarjeta para ordenar mejor los beneficios.",
}

export default function BilleteraPage() {
  return (
    <PageShell className="gap-6 py-8 md:py-10">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Personalización</p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          Mi billetera
        </h1>
        <p className="max-w-3xl text-base leading-7 text-slate-600">
          Cuéntanos qué bancos y tipos de tarjeta usas para priorizar lo que realmente te sirve.
        </p>
      </div>
      <WalletPreferencesPanel />
    </PageShell>
  )
}
