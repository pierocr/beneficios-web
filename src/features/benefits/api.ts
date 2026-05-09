import { mockBenefits } from "@/features/benefits/mock-data"
import { getBenefitRelevanceScore } from "@/features/benefits/ranking"
import { apiFetch } from "@/lib/api"
import {
  Benefit,
  BenefitSearchParams,
  BenefitsSearchResult,
  benefitSchema,
} from "@/types/benefit"

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

function tokenizeSearch(text: string) {
  return Array.from(
    new Set(
      text
        .split(/\s+/)
        .map((term) => term.trim())
        .filter((term) => term.length >= 2)
    )
  )
}

function applySearchFilters(benefits: Benefit[], params: BenefitSearchParams = {}) {
  const todayName = capitalize(
    new Intl.DateTimeFormat("es-CL", { weekday: "long" }).format(new Date())
  )

  const filtered = benefits.filter((benefit) => {
    const haystack = [
      benefit.bankName,
      benefit.merchantName,
      benefit.merchantCanonicalName,
      benefit.merchantSlug,
      benefit.categoryName,
      benefit.title,
      benefit.summary,
      benefit.termsText,
    ]
      .join(" ")
    const normalizedHaystack = normalizeText(haystack)
    const normalizedSearch = normalizeText(params.search ?? "")
    const searchTerms = tokenizeSearch(normalizedSearch)

    const matchesSearch =
      !normalizedSearch ||
      normalizedHaystack.includes(normalizedSearch) ||
      (searchTerms.length > 0 &&
        searchTerms.every((term) => normalizedHaystack.includes(term)))
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
        benefit.days.map((value) => normalizeText(value)).includes(day)
      )
    const matchesRegion =
      !params.region ||
      params.region === "nacional" ||
      !benefit.regions?.length ||
      benefit.regions.some(
        (region) =>
          normalizeText(region) === params.region ||
          normalizeText(region) === "nacional"
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
      matchesRegion &&
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
    const result = await searchBenefits({ limit: 160 })
    return result.items
  } catch {
    return mockBenefits.slice(0, 160)
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

export async function searchBenefits(
  params: BenefitSearchParams = {},
  init?: RequestInit
): Promise<BenefitsSearchResult> {
  try {
    const query = new URLSearchParams()

    if (params.search) query.set("search", params.search)
    if (params.category) query.set("category", params.category)
    params.providerSlugs?.forEach((value) => query.append("providerSlug", value))
    params.paymentTypes?.forEach((value) => query.append("paymentMethod", value))
    params.channels?.forEach((value) => query.append("channel", value))
    params.days?.forEach((value) => query.append("day", value))
    if (params.region) query.set("region", params.region)
    if (params.minBenefitValue != null) {
      query.set("minBenefitValue", String(params.minBenefitValue))
    }
    if (params.sortBy) query.set("sortBy", params.sortBy)
    if (params.todayOnly) query.set("todayOnly", "true")
    if (params.page) query.set("page", String(params.page))
    if (params.limit) query.set("limit", String(params.limit))

    const suffix = query.toString()
    const data = await apiFetch<Benefit[] | BenefitsSearchResult>(
      suffix ? `/benefits/search?${suffix}` : "/benefits/search",
      init
    )
    return normalizeBenefitsResult(data, params)
  } catch {
    const limit = params.limit ?? 48
    const page = params.page ?? 1
    const filtered = applySearchFilters(mockBenefits, params)
    const offset = (page - 1) * limit
    const items = filtered.slice(offset, offset + limit)

    return {
      items,
      page,
      limit,
      total: filtered.length,
      hasMore: offset + items.length < filtered.length,
    }
  }
}

function normalizeBenefitsResult(
  data: Benefit[] | BenefitsSearchResult,
  params: BenefitSearchParams
): BenefitsSearchResult {
  if (Array.isArray(data)) {
    const limit = params.limit ?? data.length
    const page = params.page ?? 1
    const items = data.map((benefit) => benefitSchema.parse(benefit))

    return {
      items,
      page,
      limit,
      total: items.length,
      hasMore: false,
    }
  }

  return {
    ...data,
    items: data.items.map((benefit) => benefitSchema.parse(benefit)),
  }
}
