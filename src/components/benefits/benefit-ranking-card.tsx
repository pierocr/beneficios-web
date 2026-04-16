import Link from "next/link"
import { ShieldCheck, WalletCards } from "lucide-react"

import { BenefitMedia } from "@/components/benefits/benefit-media"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  formatBenefitValue,
  formatCurrencyCLP,
  getBenefitDetailHref,
  getConfidenceLabel,
} from "@/lib/formatters"
import { Benefit } from "@/types/benefit"

export function BenefitRankingCard({
  benefit,
  rank,
}: {
  benefit: Benefit
  rank: number
}) {
  return (
    <Card className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white py-0 shadow-sm">
      <CardContent className="grid gap-4 px-0 py-0 lg:grid-cols-[220px_1fr]">
        <BenefitMedia
          imageUrl={benefit.imageUrl}
          merchantName={benefit.merchantName}
          categoryName={benefit.categoryName}
          showLabel={false}
          className="h-44 lg:h-full"
        />

        <div className="flex flex-col gap-4 px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-lg font-semibold text-white">
                #{rank}
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-950">{benefit.bankName}</p>
                <p className="text-sm text-slate-500">
                  {benefit.merchantName} · {benefit.categoryName}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-semibold tracking-tight text-slate-950">
                {formatBenefitValue(benefit)}
              </p>
              <p className="text-sm text-emerald-700">Tope {formatCurrencyCLP(benefit.capAmount)}</p>
            </div>
          </div>

          <div className="grid gap-2 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-4">
            <p>Días: {benefit.days.join(", ")}</p>
            <p>Pago: {benefit.paymentMethods.join(", ")}</p>
            <p>Canal: {benefit.channel}</p>
            <p>Confianza: {getConfidenceLabel(benefit.confidenceScore)}</p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                <ShieldCheck className="size-3" />
                {benefit.validationStatus}
              </Badge>
              <Badge variant="secondary">
                <WalletCards className="size-3" />
                {benefit.paymentMethods.join(" / ")}
              </Badge>
            </div>

            <Link
              href={getBenefitDetailHref(benefit.providerSlug, benefit.merchantSlug)}
              className="text-sm font-semibold text-slate-900 underline-offset-4 hover:underline"
            >
              Ver detalle
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
