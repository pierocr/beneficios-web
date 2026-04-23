import { Benefit } from "@/types/benefit"

const fastFoodMerchants = new Set([
  "burger king",
  "doggis",
  "domino's pizza",
  "dominos pizza",
  "dunkin",
  "kfc",
  "juan maestro",
  "mcdonald's",
  "mcdonalds",
  "papa john's",
  "papa johns",
  "pedro juan y diego",
  "pizza hut",
  "starbucks",
  "subway",
  "tarragona",
  "telepizza",
  "tommy beans",
  "wendy's",
])

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .toLowerCase()
}

function getTodayName() {
  return normalizeText(
    new Intl.DateTimeFormat("es-CL", {
      timeZone: "America/Santiago",
      weekday: "long",
    }).format(new Date())
  )
}

function isEveryday(day: string) {
  return normalizeText(day) === "todos los dias"
}

export function isBenefitAvailableToday(benefit: Benefit) {
  const todayName = getTodayName()

  return benefit.days.some((day) => {
    const normalizedDay = normalizeText(day)

    return isEveryday(day) || normalizedDay === todayName
  })
}

export function getBenefitTodayLabel(benefit: Benefit) {
  if (benefit.days.some(isEveryday)) return "Todos los días"

  return new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    weekday: "long",
  })
    .format(new Date())
    .replace(/^\w/, (letter) => letter.toUpperCase())
}

export function isFastFoodBenefit(benefit: Benefit) {
  const merchant = normalizeText(benefit.merchantCanonicalName || benefit.merchantName)

  return Array.from(fastFoodMerchants).some((name) =>
    merchant.includes(normalizeText(name))
  )
}

function getPercentageValue(benefit: Benefit) {
  if (
    ["discount", "cashback"].includes(benefit.benefitType) &&
    benefit.benefitValueUnit === "percentage"
  ) {
    return benefit.benefitValue
  }

  return 0
}

export function getBenefitPercentageValue(benefit: Benefit) {
  return getPercentageValue(benefit)
}

export function isFoodCategory(categoryName: string) {
  const category = normalizeText(categoryName)

  return [
    "cafeteria",
    "comida",
    "delivery",
    "hamburgues",
    "pizza",
    "restaurante",
  ].some((keyword) => category.includes(keyword))
}

export function isMassFoodBenefit(benefit: Benefit) {
  const category = normalizeText(benefit.categoryName)

  return (
    isFastFoodBenefit(benefit) ||
    isFoodCategory(benefit.categoryName) ||
    category.includes("supermercado")
  )
}

export function isDailyFoodRecommendation(benefit: Benefit) {
  const category = normalizeText(benefit.categoryName)
  const discount = getPercentageValue(benefit)
  const isTargetCategory =
    isFastFoodBenefit(benefit) ||
    category.includes("comida rapida") ||
    category.includes("restaurante") ||
    category.includes("cafeteria")

  return isTargetCategory && discount >= 35
}

function getBenefitPriorityTier(benefit: Benefit) {
  if (isFastFoodBenefit(benefit)) return 0
  if (isFoodCategory(benefit.categoryName)) return 1

  return 2
}

export function getBenefitRelevanceScore(benefit: Benefit) {
  const discount = getPercentageValue(benefit)
  const category = normalizeText(benefit.categoryName)
  const capScore = benefit.capAmount ? Math.min(benefit.capAmount / 1000, 18) : 0
  const categoryScore =
    isFoodCategory(benefit.categoryName)
      ? 28
      : category.includes("supermercado")
        ? 10
        : 0
  const massConsumptionScore = isFastFoodBenefit(benefit) ? 36 : 0
  const availabilityScore = benefit.days.some((day) =>
    normalizeText(day).includes("todos los dias")
  )
    ? 8
    : Math.min(benefit.days.length * 2, 6)
  const validationScore =
    benefit.validationStatus === "validated"
      ? 8
      : benefit.validationStatus === "monitoring"
        ? 3
        : -6

  return (
    discount * benefit.confidenceScore +
    capScore +
    categoryScore +
    massConsumptionScore +
    availabilityScore +
    validationScore
  )
}

export function sortBenefitsByRelevance(benefits: Benefit[]) {
  return [...benefits].sort((left, right) => {
    const tierDifference =
      getBenefitPriorityTier(left) - getBenefitPriorityTier(right)

    if (tierDifference !== 0) return tierDifference

    const scoreDifference =
      getBenefitRelevanceScore(right) - getBenefitRelevanceScore(left)

    if (scoreDifference !== 0) return scoreDifference

    return getPercentageValue(right) - getPercentageValue(left)
  })
}

export function sortTodayBenefitsByRecommendation(benefits: Benefit[]) {
  return [...benefits].sort((left, right) => {
    const discountDifference =
      getPercentageValue(right) - getPercentageValue(left)

    if (discountDifference !== 0) return discountDifference

    return getBenefitRelevanceScore(right) - getBenefitRelevanceScore(left)
  })
}
