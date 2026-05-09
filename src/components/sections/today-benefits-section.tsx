import { BenefitCard } from "@/components/benefits/benefit-card"
import {
  isFastFoodBenefit,
  isFoodCategory,
  sortTodayBenefitsByRecommendation,
} from "@/features/benefits/ranking"
import { Benefit } from "@/types/benefit"

const TOMORROW_LIMIT = 18

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function getChileWeekdayName(offsetDays = 0) {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)

  return normalizeText(
    new Intl.DateTimeFormat("es-CL", {
      timeZone: "America/Santiago",
      weekday: "long",
    }).format(date)
  )
}

function isEveryday(day: string) {
  return normalizeText(day) === "todos los dias"
}

function isAvailableOnWeekday(benefit: Benefit, weekdayName: string) {
  return benefit.days.some((day) => {
    const normalizedDay = normalizeText(day)

    return isEveryday(day) || normalizedDay === weekdayName
  })
}

function isFoodDiscount(benefit: Benefit) {
  return (
    (isFastFoodBenefit(benefit) || isFoodCategory(benefit.categoryName)) &&
    ["discount", "cashback"].includes(benefit.benefitType) &&
    benefit.benefitValue > 0
  )
}

function DiscountSection({
  eyebrow,
  title,
  description,
  discounts,
}: {
  eyebrow: string
  title: string
  description: string
  discounts: Benefit[]
}) {
  if (discounts.length === 0) return null

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            {eyebrow}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
            {title}
          </h2>
        </div>
        <p className="max-w-md text-sm text-slate-500">{description}</p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3">
        {discounts.map((benefit) => (
          <BenefitCard key={benefit.id} benefit={benefit} variant="compact" />
        ))}
      </div>
    </section>
  )
}

export function TodayBenefitsSection({ benefits }: { benefits: Benefit[] }) {
  const todayName = getChileWeekdayName()
  const tomorrowName = getChileWeekdayName(1)
  const todayDiscounts = sortTodayBenefitsByRecommendation(
    benefits.filter(
      (benefit) => isAvailableOnWeekday(benefit, todayName) && isFoodDiscount(benefit)
    )
  )
  const tomorrowDiscounts = sortTodayBenefitsByRecommendation(
    benefits.filter(
      (benefit) =>
        isAvailableOnWeekday(benefit, tomorrowName) && isFoodDiscount(benefit)
    )
  ).slice(0, TOMORROW_LIMIT)

  return (
    <>
      <DiscountSection
        eyebrow="Descuentos de hoy"
        title="Mejores descuentos de comida para hoy"
        description="Comida rápida, restaurantes, cafeterías y delivery disponibles durante el día actual."
        discounts={todayDiscounts}
      />
      <DiscountSection
        eyebrow="Descuentos de mañana"
        title="Principales descuentos de comida para mañana"
        description="Una vista anticipada con los descuentos más fuertes para planificar dónde pagar."
        discounts={tomorrowDiscounts}
      />
    </>
  )
}
