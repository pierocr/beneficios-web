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
import { BenefitMedia } from "@/components/benefits/benefit-media"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { getBenefitTodayLabel } from "@/features/benefits/ranking"
import {
  formatBenefitValue,
  formatCurrencyCLP,
  formatRelativeBenefitDate,
  getBenefitDetailHref,
  getConfidenceLabel,
} from "@/lib/formatters"
import { cn } from "@/lib/utils"
import { Benefit } from "@/types/benefit"

function trustBadgeVariant(label: string) {
  if (label === "Alta confianza") return "secondary"
  if (label === "Media confianza") return "outline"
  return "destructive"
}

export function BenefitCard({
  benefit,
  variant = "default",
}: {
  benefit: Benefit
  variant?: "default" | "compact"
}) {
  const confidenceLabel = getConfidenceLabel(benefit.confidenceScore)
  const isCompact = variant === "compact"
  const visibleConditions = isCompact ? 2 : 3
  const extraConditions = Math.max(benefit.conditions.length - visibleConditions, 0)

  if (isCompact) {
    return (
      <Card className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white py-0 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <Link
          href={getBenefitDetailHref(benefit.providerSlug, benefit.merchantSlug)}
          className="flex min-h-64 flex-col"
        >
          <BenefitMedia
            imageUrl={benefit.imageUrl}
            merchantName={benefit.merchantName}
            categoryName={benefit.categoryName}
            showLabel={false}
            className="h-28"
          />

          <div className="flex flex-1 flex-col justify-between gap-4 p-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {benefit.bankName}
                </p>
                <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-slate-950">
                  {benefit.merchantName}
                </h3>
              </div>

              <div className="flex items-end gap-2">
                <span className="text-4xl font-semibold tracking-tight text-slate-950">
                  {formatBenefitValue(benefit)}
                </span>
                <span className="pb-1 text-xs text-slate-500">descuento</span>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 shrink-0 text-slate-400" />
                <span className="truncate">{getBenefitTodayLabel(benefit)}</span>
              </div>
              {benefit.capAmount != null && (
                <div className="flex items-center gap-2">
                  <Store className="size-4 shrink-0 text-slate-400" />
                  <span className="truncate">Tope {formatCurrencyCLP(benefit.capAmount)}</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        "border border-slate-200/80 bg-white py-0 shadow-[0_16px_40px_rgba(15,23,42,0.06)]",
        isCompact ? "gap-3 rounded-2xl" : "rounded-[28px]"
      )}
    >
      <CardHeader
        className={cn(
          "border-b border-slate-100",
          isCompact ? "gap-3 px-3.5 pt-3.5 pb-3" : "gap-4 px-5 pt-5 pb-4"
        )}
      >
        <Link href={getBenefitDetailHref(benefit.providerSlug, benefit.merchantSlug)}>
          <BenefitMedia
            imageUrl={benefit.imageUrl}
            merchantName={benefit.merchantName}
            categoryName={benefit.categoryName}
            className={cn("h-44 rounded-[22px]", isCompact && "h-32 rounded-2xl")}
          />
        </Link>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{benefit.bankName}</p>
            <p
              className={cn(
                "mt-1 truncate text-xs uppercase text-slate-400",
                isCompact ? "tracking-[0.12em]" : "tracking-[0.18em]"
              )}
            >
              {benefit.categoryName}
            </p>
          </div>
          {benefit.featuredTag ? (
            <Badge className="shrink-0 bg-amber-100 text-amber-800">{benefit.featuredTag}</Badge>
          ) : (
            <Badge className="shrink-0" variant={trustBadgeVariant(confidenceLabel)}>
              {isCompact ? confidenceLabel.replace(" confianza", "") : confidenceLabel}
            </Badge>
          )}
        </div>

        <Link href={getBenefitDetailHref(benefit.providerSlug, benefit.merchantSlug)}>
          <div className={cn("space-y-2", isCompact && "space-y-1.5")}>
            <h3
              className={cn(
                "font-semibold tracking-tight text-slate-950",
                isCompact ? "line-clamp-1 text-lg" : "text-xl"
              )}
            >
              {benefit.merchantName}
            </h3>
            <div className="flex items-end gap-2">
              <span
                className={cn(
                  "font-semibold tracking-tight text-slate-950",
                  isCompact ? "text-3xl" : "text-4xl"
                )}
              >
                {formatBenefitValue(benefit)}
              </span>
              <span className="pb-1 text-xs text-slate-500">ahorro</span>
            </div>
            <p
              className={cn(
                "text-sm text-slate-600",
                isCompact ? "line-clamp-2 leading-5" : "leading-6"
              )}
            >
              {benefit.summary}
            </p>
          </div>
        </Link>
      </CardHeader>

      <CardContent className={cn("space-y-3", isCompact ? "px-3.5 py-3" : "px-5 py-4")}>
        <div
          className={cn(
            "grid gap-2 text-sm text-slate-600",
            isCompact ? "text-xs" : "sm:grid-cols-2"
          )}
        >
          <div className="flex items-center gap-2">
            <CalendarDays className={cn("shrink-0 text-slate-400", isCompact ? "size-3.5" : "size-4")} />
            <span className="truncate">{benefit.days.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className={cn("shrink-0 text-slate-400", isCompact ? "size-3.5" : "size-4")} />
            <span className="truncate">{benefit.paymentMethods.join(", ")}</span>
          </div>
          {!isCompact && (
            <>
              <div className="flex items-center gap-2">
                <Tv className="size-4 text-slate-400" />
                <span className="capitalize">{benefit.channel}</span>
              </div>
              <div className="flex items-center gap-2">
                <Store className="size-4 text-slate-400" />
                <span>Tope: {formatCurrencyCLP(benefit.capAmount)}</span>
              </div>
            </>
          )}
          {isCompact && (
            <div className="flex items-center gap-2">
              <Store className="size-3.5 shrink-0 text-slate-400" />
              <span className="truncate">Tope: {formatCurrencyCLP(benefit.capAmount)}</span>
            </div>
          )}
        </div>

        {benefit.validationStatus === "needs_review" && (
          <div className="flex items-start gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            <span>La fuente cambió recientemente. Conviene revisar condiciones antes de pagar.</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          {benefit.conditions.slice(0, visibleConditions).map((condition) => (
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

      <CardFooter
        className={cn(
          "justify-between gap-3 border-t border-slate-100 bg-slate-50/70",
          isCompact ? "px-3.5 py-3" : "px-5 py-4"
        )}
      >
        <div className="min-w-0 truncate text-xs text-slate-500">
          Actualizado {formatRelativeBenefitDate(benefit.lastUpdated)}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {!isCompact && (
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link href={`/comparar?merchant=${benefit.merchantSlug}`}>Comparar</Link>
            </Button>
          )}
          <Button
            variant="outline"
            size={isCompact ? "icon-sm" : "sm"}
            className="rounded-full"
            aria-label={`Guardar beneficio de ${benefit.merchantName}`}
          >
            <BookmarkPlus className="size-4" />
            {!isCompact && "Guardar"}
          </Button>
          <Button
            asChild
            size={isCompact ? "sm" : "sm"}
            className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
          >
            <Link href={getBenefitDetailHref(benefit.providerSlug, benefit.merchantSlug)}>
              {isCompact ? "Ver" : "Ver detalle"}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
