import Link from "next/link"
import {
  ArrowRight,
  BookmarkPlus,
  CalendarDays,
  CircleAlert,
  CreditCard,
  Store,
  Tv,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  formatBenefitValue,
  formatCurrencyCLP,
  formatRelativeBenefitDate,
  getBenefitDetailHref,
  getConfidenceLabel,
} from "@/lib/formatters"
import { Benefit } from "@/types/benefit"

function trustBadgeVariant(label: string) {
  if (label === "Alta confianza") return "secondary"
  if (label === "Media confianza") return "outline"
  return "destructive"
}

export function BenefitCard({ benefit }: { benefit: Benefit }) {
  const confidenceLabel = getConfidenceLabel(benefit.confidenceScore)
  const extraConditions = Math.max(benefit.conditions.length - 3, 0)

  return (
    <Card className="rounded-[28px] border border-slate-200/80 bg-white py-0 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <CardHeader className="gap-4 border-b border-slate-100 px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">{benefit.bankName}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
              {benefit.categoryName}
            </p>
          </div>
          {benefit.featuredTag ? (
            <Badge className="bg-amber-100 text-amber-800">{benefit.featuredTag}</Badge>
          ) : (
            <Badge variant={trustBadgeVariant(confidenceLabel)}>{confidenceLabel}</Badge>
          )}
        </div>

        <Link href={getBenefitDetailHref(benefit.providerSlug, benefit.merchantSlug)}>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight text-slate-950">
              {benefit.merchantName}
            </h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-semibold tracking-tight text-slate-950">
                {formatBenefitValue(benefit)}
              </span>
              <span className="pb-1 text-sm text-slate-500">de ahorro</span>
            </div>
            <p className="text-sm leading-6 text-slate-600">{benefit.summary}</p>
          </div>
        </Link>
      </CardHeader>

      <CardContent className="space-y-3 px-5 py-4">
        <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-slate-400" />
            <span>{benefit.days.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="size-4 text-slate-400" />
            <span>{benefit.paymentMethods.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tv className="size-4 text-slate-400" />
            <span className="capitalize">{benefit.channel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Store className="size-4 text-slate-400" />
            <span>Tope: {formatCurrencyCLP(benefit.capAmount)}</span>
          </div>
        </div>

        {benefit.validationStatus === "needs_review" && (
          <div className="flex items-start gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            <span>La fuente cambió recientemente. Conviene revisar condiciones antes de pagar.</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          {benefit.conditions.slice(0, 3).map((condition) => (
            <span
              key={condition}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1"
            >
              {condition}
            </span>
          ))}
          {extraConditions > 0 && (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">
              +{extraConditions} condiciones
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4">
        <div className="text-xs text-slate-500">
          Actualizado {formatRelativeBenefitDate(benefit.lastUpdated)}
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link href={`/comparar?merchant=${benefit.merchantSlug}`}>Comparar</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            aria-label={`Guardar beneficio de ${benefit.merchantName}`}
          >
            <BookmarkPlus className="size-4" />
            Guardar
          </Button>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
          >
            <Link href={getBenefitDetailHref(benefit.providerSlug, benefit.merchantSlug)}>
              Ver detalle
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
