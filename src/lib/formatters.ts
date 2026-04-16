import { Benefit } from "@/types/benefit"

export function formatCurrencyCLP(value: number | null | undefined) {
  if (value == null) return "Sin tope informado"

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatBenefitValue(
  benefit: Pick<Benefit, "benefitValue" | "benefitValueUnit" | "benefitType">
) {
  if (benefit.benefitValueUnit === "percentage") {
    return `${benefit.benefitValue}%`
  }

  if (benefit.benefitValueUnit === "clp") {
    return formatCurrencyCLP(benefit.benefitValue)
  }

  if (benefit.benefitValueUnit === "months") {
    return `${benefit.benefitValue} cuotas`
  }

  if (benefit.benefitValueUnit === "points") {
    return `${benefit.benefitValue} pts`
  }

  return benefit.benefitType === "cashback" ? "Cashback" : "Beneficio"
}

export function getConfidenceLabel(score: number) {
  if (score >= 0.85) return "Alta confianza"
  if (score >= 0.7) return "Media confianza"
  return "Requiere revisión"
}

export function getValidationLabel(status: Benefit["validationStatus"]) {
  if (status === "validated") return "Validado"
  if (status === "monitoring") return "Monitoreando cambios"
  return "Requiere revisión"
}

export function getBenefitDetailHref(providerSlug: string, merchantSlug: string) {
  return `/beneficios/${providerSlug}/${merchantSlug}`
}

export function formatRelativeBenefitDate(date: string) {
  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "short",
  }).format(new Date(date))
}
