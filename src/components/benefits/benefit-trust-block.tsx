import Link from "next/link"
import { ExternalLink, ShieldAlert, ShieldCheck, Sparkles } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  formatRelativeBenefitDate,
  getConfidenceLabel,
  getValidationLabel,
} from "@/lib/formatters"
import { Benefit } from "@/types/benefit"

export function BenefitTrustBlock({ benefit }: { benefit: Benefit }) {
  return (
    <Card className="rounded-[28px] border border-slate-200/80 bg-white py-5 shadow-sm">
      <CardHeader>
        <CardTitle>Señales de confianza</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 px-5 text-sm text-slate-600">
        <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
          <ShieldCheck className="mt-0.5 size-4 text-emerald-600" />
          <div>
            <p className="font-medium text-slate-950">
              {getConfidenceLabel(benefit.confidenceScore)}
            </p>
            <p>Score {benefit.confidenceScore.toFixed(2)} basado en claridad, consistencia y frescura de la fuente.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
          <Sparkles className="mt-0.5 size-4 text-slate-700" />
          <div>
            <p className="font-medium text-slate-950">
              {getValidationLabel(benefit.validationStatus)}
            </p>
            <p>Última actualización: {formatRelativeBenefitDate(benefit.lastUpdated)}.</p>
          </div>
        </div>
        {benefit.validationStatus === "needs_review" && (
          <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 text-amber-900">
            <ShieldAlert className="mt-0.5 size-4" />
            <p>Detectamos señales que ameritan revisión manual antes de usar este beneficio.</p>
          </div>
        )}
        <Link
          href={benefit.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 font-medium text-slate-900 underline-offset-4 hover:underline"
        >
          Fuente original
          <ExternalLink className="size-4" />
        </Link>
      </CardContent>
    </Card>
  )
}
