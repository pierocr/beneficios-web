import { mockBenefits } from "@/features/benefits/mock-data"
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
    const matchesToday =
      !params.todayOnly ||
      benefit.days.includes("Todos los días") ||
      benefit.days.includes(todayName)

    return (
      matchesSearch &&
      matchesCategory &&
      matchesProviders &&
      matchesPayment &&
      matchesChannel &&
      matchesToday
    )
  })

  return filtered.sort((left, right) => {
    if (params.sortBy === "discount") return right.benefitValue - left.benefitValue
    if (params.sortBy === "ending") {
      return new Date(left.validUntil).getTime() - new Date(right.validUntil).getTime()
    }

    return (
      right.benefitValue * right.confidenceScore -
      left.benefitValue * left.confidenceScore
    )
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
