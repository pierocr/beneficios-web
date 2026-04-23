import type { Metadata } from "next"

import { PageShell } from "@/components/layout/page-shell"
import { HomeHero } from "@/components/sections/home-hero"
import { PopularCategoriesSection } from "@/components/sections/popular-categories-section"
import { ProvidersSection } from "@/components/sections/providers-section"
import { TodayBenefitsSection } from "@/components/sections/today-benefits-section"
import { TransparencySection } from "@/components/sections/transparency-section"
import { getBenefits } from "@/features/benefits/api"

export const metadata: Metadata = {
  title: "Hoy",
  description:
    "Encuentra qué tarjeta te conviene usar hoy comparando descuentos, topes y condiciones de bancos y fintechs en Chile.",
}

export default async function HomePage() {
  const benefits = await getBenefits()

  return (
    <PageShell className="gap-10 py-8 md:gap-14 md:py-10">
      <HomeHero benefits={benefits} />
      <TodayBenefitsSection benefits={benefits} />
      <PopularCategoriesSection benefits={benefits} />
      <ProvidersSection benefits={benefits} />
      <TransparencySection />
    </PageShell>
  )
}
