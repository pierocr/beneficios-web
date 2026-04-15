import { z } from "zod"

export const benefitSchema = z.object({
  id: z.string(),
  providerSlug: z.string(),
  bankName: z.string(),
  merchantName: z.string(),
  merchantCanonicalName: z.string(),
  merchantSlug: z.string(),
  categoryName: z.string(),
  title: z.string(),
  benefitType: z.enum(["discount", "cashback", "installments", "points"]),
  benefitValue: z.number(),
  benefitValueUnit: z.enum(["percentage", "clp", "months", "points"]),
  days: z.array(z.string()),
  channel: z.enum(["online", "presencial", "ambos"]),
  paymentMethods: z.array(z.string()),
  capAmount: z.number().nullable(),
  termsText: z.string(),
  sourceUrl: z.string().url(),
  confidenceScore: z.number(),
  validationStatus: z.enum(["validated", "monitoring", "needs_review"]),
  validUntil: z.string(),
  lastUpdated: z.string(),
  summary: z.string(),
  conditions: z.array(z.string()),
  featuredTag: z.string().nullable().optional(),
})

export type Benefit = z.infer<typeof benefitSchema>

export type BenefitSearchParams = {
  search?: string
  category?: string
  providerSlugs?: string[]
  paymentTypes?: string[]
  channels?: Array<Benefit["channel"]>
  sortBy?: "best" | "discount" | "ending"
  todayOnly?: boolean
}
