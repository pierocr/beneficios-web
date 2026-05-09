"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import {
  getBenefitByMerchant,
  searchBenefits,
} from "@/features/benefits/api"
import { BenefitSearchParams } from "@/types/benefit"

export function useBenefits(
  params: BenefitSearchParams = {},
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: ["benefits", params],
    queryFn: ({ signal }) => searchBenefits(params, { signal }),
    enabled: options.enabled,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 15,
  })
}

export function useBenefitDetail(providerSlug: string, merchantSlug: string) {
  return useQuery({
    queryKey: ["benefit-detail", providerSlug, merchantSlug],
    queryFn: () => getBenefitByMerchant(providerSlug, merchantSlug),
    enabled: Boolean(providerSlug && merchantSlug),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 15,
  })
}
