import { mockBenefits } from "@/features/benefits/mock-data"
import { getBenefitRelevanceScore } from "@/features/benefits/ranking"
import { apiFetch } from "@/lib/api"
import { Benefit, BenefitSearchParams, benefitSchema } from "@/types/benefit"

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function applySearchFilters(benefits: Benefit[], params: BenefitSearchParams = {}) {
  const todayName = capitalize(
    new Intl.DateTimeFormat("es-CL", { weekday: "long" }).format(new Date())
  )

  const filtered = benefits.filter((benefit) => {
    const haystack = [
      benefit.bankName,
      benefit.merchantName,
      benefit.categoryName,
      benefit.title,
    ]
      .join(" ")
      .toLowerCase()

    const matchesSearch =
      !params.search || haystack.includes(params.search.toLowerCase())
    const matchesCategory =
      !params.category || benefit.categoryName === params.category
    const matchesProviders =
      !params.providerSlugs?.length ||
      params.providerSlugs.includes(benefit.providerSlug)
    const matchesPayment =
      !params.paymentTypes?.length ||
      params.paymentTypes.some((method) => benefit.paymentMethods.includes(method))
    const matchesChannel =
      !params.channels?.length || params.channels.includes(benefit.channel)
    const matchesDays =
      !params.days?.length ||
      benefit.days.includes("Todos los dias") ||
      params.days.some((day) =>
        benefit.days
          .map((value) =>
            value
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
          )
          .includes(day)
      )
    const matchesMinDiscount =
      params.minBenefitValue == null ||
      (["discount", "cashback"].includes(benefit.benefitType) &&
        benefit.benefitValueUnit === "percentage" &&
        benefit.benefitValue >= params.minBenefitValue)
    const matchesToday =
      !params.todayOnly ||
      benefit.days.includes("Todos los días") ||
      benefit.days.includes("Todos los dias") ||
      benefit.days.includes(todayName)

    return (
      matchesSearch &&
      matchesCategory &&
      matchesProviders &&
      matchesPayment &&
      matchesChannel &&
      matchesDays &&
      matchesMinDiscount &&
      matchesToday
    )
  })

  return filtered.sort((left, right) => {
    const leftDiscount =
      ["discount", "cashback"].includes(left.benefitType) &&
      left.benefitValueUnit === "percentage"
        ? left.benefitValue
        : 0
    const rightDiscount =
      ["discount", "cashback"].includes(right.benefitType) &&
      right.benefitValueUnit === "percentage"
        ? right.benefitValue
        : 0

    if (params.sortBy === "discount") return rightDiscount - leftDiscount
    if (params.sortBy === "ending") {
      return new Date(left.validUntil).getTime() - new Date(right.validUntil).getTime()
    }

    return getBenefitRelevanceScore(right) - getBenefitRelevanceScore(left)
  })
}

export async function getBenefits() {
  try {
    const data = await apiFetch<Benefit[]>("/benefits")
    return data.map((benefit) => benefitSchema.parse(benefit))
  } catch {
    return mockBenefits
  }
}

export async function getBenefitByMerchant(
  providerSlug: string,
  merchantSlug: string
) {
  try {
    const data = await apiFetch<Benefit>(
      `/benefits/${providerSlug}/${merchantSlug}`
    )
    return benefitSchema.parse(data)
  } catch {
    return (
      mockBenefits.find(
        (benefit) =>
          benefit.providerSlug === providerSlug &&
          benefit.merchantSlug === merchantSlug
      ) || null
    )
  }
}

export async function searchBenefits(params: BenefitSearchParams = {}) {
  try {
    const query = new URLSearchParams()

    if (params.search) query.set("search", params.search)
    if (params.category) query.set("category", params.category)
    params.providerSlugs?.forEach((value) => query.append("providerSlug", value))
    params.paymentTypes?.forEach((value) => query.append("paymentMethod", value))
    params.channels?.forEach((value) => query.append("channel", value))
    params.days?.forEach((value) => query.append("day", value))
    if (params.minBenefitValue != null) {
      query.set("minBenefitValue", String(params.minBenefitValue))
    }
    if (params.sortBy) query.set("sortBy", params.sortBy)
    if (params.todayOnly) query.set("todayOnly", "true")

    const suffix = query.toString()
    const data = await apiFetch<Benefit[]>(
      suffix ? `/benefits/search?${suffix}` : "/benefits/search"
    )
    return data.map((benefit) => benefitSchema.parse(benefit))
  } catch {
    return applySearchFilters(mockBenefits, params)
  }
}
