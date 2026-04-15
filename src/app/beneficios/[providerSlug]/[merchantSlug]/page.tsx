import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { BenefitCard } from "@/components/benefits/benefit-card"
import { BenefitDetailHero } from "@/components/benefits/benefit-detail-hero"
import { BenefitTrustBlock } from "@/components/benefits/benefit-trust-block"
import { PageShell } from "@/components/layout/page-shell"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getBenefitByMerchant, getBenefits } from "@/features/benefits/api"
import { formatCurrencyCLP, formatRelativeBenefitDate } from "@/lib/formatters"

type DetailProps = {
  params: Promise<{ providerSlug: string; merchantSlug: string }>
}

export async function generateMetadata({ params }: DetailProps): Promise<Metadata> {
  const { providerSlug, merchantSlug } = await params
  const benefit = await getBenefitByMerchant(providerSlug, merchantSlug)

  if (!benefit) {
    return { title: "Beneficio no encontrado" }
  }

  return {
    title: `${benefit.bankName} en ${benefit.merchantName}`,
    description: `${benefit.title}. Revisa tope, días, canal, validación y fuente original.`,
  }
}

export default async function BenefitDetailPage({ params }: DetailProps) {
  const { providerSlug, merchantSlug } = await params
  const benefit = await getBenefitByMerchant(providerSlug, merchantSlug)

  if (!benefit) {
    notFound()
  }

  const similarBenefits = (await getBenefits())
    .filter(
      (item) =>
        item.id !== benefit.id &&
        (item.merchantSlug === benefit.merchantSlug ||
          item.categoryName === benefit.categoryName)
    )
    .slice(0, 3)

  return (
    <PageShell className="gap-6 py-8 md:gap-8 md:py-10">
      <BenefitDetailHero benefit={benefit} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-6">
          <Card className="rounded-[28px] border border-slate-200/80 bg-white py-5 shadow-sm">
            <CardHeader>
              <CardTitle>Resumen aplicable</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 px-5 text-sm text-slate-600 sm:grid-cols-2">
              <p>Días: {benefit.days.join(", ")}</p>
              <p>Medio de pago: {benefit.paymentMethods.join(", ")}</p>
              <p>Canal: {benefit.channel}</p>
              <p>Tope: {formatCurrencyCLP(benefit.capAmount)}</p>
              <p>Vigencia simulada: hasta {formatRelativeBenefitDate(benefit.validUntil)}</p>
              <p>Última actualización: {formatRelativeBenefitDate(benefit.lastUpdated)}</p>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border border-slate-200/80 bg-white py-5 shadow-sm">
            <CardHeader>
              <CardTitle>Condiciones importantes</CardTitle>
            </CardHeader>
            <CardContent className="px-5">
              <ul className="grid gap-3 text-sm leading-6 text-slate-600">
                {benefit.conditions.map((condition) => (
                  <li key={condition} className="rounded-2xl bg-slate-50 px-4 py-3">
                    {condition}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border border-slate-200/80 bg-white py-5 shadow-sm">
            <CardHeader>
              <CardTitle>Términos completos</CardTitle>
            </CardHeader>
            <CardContent className="px-5">
              <Accordion type="single" collapsible>
                <AccordionItem value="terms">
                  <AccordionTrigger>Ver términos y letra chica</AccordionTrigger>
                  <AccordionContent>{benefit.termsText}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                  Alternativas
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  Comparar beneficios similares
                </h2>
              </div>
              <Button asChild variant="outline" className="rounded-full">
                <Link href={`/comparar?merchant=${benefit.merchantSlug}`}>Ir a comparar</Link>
              </Button>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {similarBenefits.map((item) => (
                <BenefitCard key={item.id} benefit={item} />
              ))}
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <BenefitTrustBlock benefit={benefit} />
        </aside>
      </div>
    </PageShell>
  )
}
