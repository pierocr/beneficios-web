import Link from "next/link"
import { SearchX } from "lucide-react"

import { Button } from "@/components/ui/button"

export function BenefitEmptyState({
  title = "No encontramos beneficios con esos filtros",
  description = "Prueba con otra categoría, limpia filtros o busca un comercio más amplio.",
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-300 bg-white/80 px-6 py-14 text-center shadow-sm">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <SearchX className="size-6" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">{description}</p>
      <Button asChild className="mt-6 rounded-full bg-slate-950 text-white hover:bg-slate-800">
        <Link href="/explorar">Explorar todos los beneficios</Link>
      </Button>
    </div>
  )
}
