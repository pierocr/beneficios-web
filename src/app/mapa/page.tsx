import type { Metadata } from "next"

import { PageShell } from "@/components/layout/page-shell"
import { NearbyMapView } from "@/components/sections/nearby-map-view"
import { getBenefits } from "@/features/benefits/api"

export const metadata: Metadata = {
  title: "Mapa",
  description:
    "Encuentra descuentos cercanos usando tu ubicación y una vista de mapa preparada para beneficios georreferenciados.",
}

export default async function MapPage() {
  const benefits = await getBenefits()

  return (
    <PageShell className="max-w-[100rem] gap-8 py-8 md:py-10">
      <NearbyMapView benefits={benefits} />
    </PageShell>
  )
}
