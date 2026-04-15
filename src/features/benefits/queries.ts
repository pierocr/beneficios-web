"use client"

import { useQuery } from "@tanstack/react-query"

import {
  getBenefitByMerchant,
  getBenefits,
  searchBenefits,
} from "@/features/benefits/api"
import { BenefitSearchParams } from "@/types/benefit"

export function useBenefits(params: BenefitSearchParams = {}) {
  return useQuery({
    queryKey: ["benefits", params],
    queryFn: () =>
      Object.keys(params).length > 0 ? searchBenefits(params) : getBenefits(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useBenefitDetail(providerSlug: string, merchantSlug: string) {
  return useQuery({
    queryKey: ["benefit-detail", providerSlug, merchantSlug],
    queryFn: () => getBenefitByMerchant(providerSlug, merchantSlug),
    enabled: Boolean(providerSlug && merchantSlug),
    staleTime: 1000 * 60 * 5,
  })
}
