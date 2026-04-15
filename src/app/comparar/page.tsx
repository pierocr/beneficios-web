import type { Metadata } from "next"

import { PageShell } from "@/components/layout/page-shell"
import { CompareView } from "@/components/sections/compare-view"

export const metadata: Metadata = {
  title: "Comparar bancos",
  description:
    "Compara qué banco, tarjeta o fintech conviene más para un comercio o categoría específica.",
}

export default async function CompararPage({
  searchParams,
}: {
  searchParams: Promise<{ merchant?: string }>
}) {
  const params = await searchParams

  return (
    <PageShell className="py-8 md:py-10">
      <CompareView initialSearch={params.merchant || ""} />
    </PageShell>
  )
}
