import { Benefit } from "@/types/benefit"

export function rankBenefitsForComparison(
  benefits: Benefit[],
  search: string | undefined
) {
  const normalized = search?.trim().toLowerCase()

  const filtered = !normalized
    ? benefits
    : benefits.filter((benefit) =>
        [benefit.merchantName, benefit.categoryName]
          .join(" ")
          .toLowerCase()
          .includes(normalized)
      )

  return [...filtered].sort((left, right) => {
    const leftScore = left.benefitValue + left.confidenceScore * 10
    const rightScore = right.benefitValue + right.confidenceScore * 10
    return rightScore - leftScore
  })
}
