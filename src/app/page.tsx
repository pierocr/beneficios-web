import type { Metadata } from "next"

import { PageShell } from "@/components/layout/page-shell"
import { HomeHero } from "@/components/sections/home-hero"
import { TodayBenefitsSection } from "@/components/sections/today-benefits-section"
import { TransparencySection } from "@/components/sections/transparency-section"
import { getBenefits } from "@/features/benefits/api"

export const metadata: Metadata = {
  title: "Hoy",
  description:
    "Luppa te ayuda a encontrar descuentos y beneficios para salir más, gastar menos y elegir mejor dónde pagar.",
}

export default async function HomePage() {
  const benefits = await getBenefits()

  return (
    <PageShell className="max-w-[100rem] gap-10 py-8 md:gap-14 md:py-10">
      <HomeHero benefits={benefits} />
      <TodayBenefitsSection benefits={benefits} />
      <TransparencySection />
    </PageShell>
  )
}
