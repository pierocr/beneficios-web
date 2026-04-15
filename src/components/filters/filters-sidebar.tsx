"use client"

import { RotateCcw } from "lucide-react"

import { FilterChip } from "@/components/filters/filter-chip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { walletCardTypes, walletProviders } from "@/features/wallet/wallet-options"
import { CATEGORY_ORDER, CHANNEL_OPTIONS } from "@/lib/constants"
import { useFiltersStore } from "@/stores/filters-store"

export function FiltersSidebar() {
  const filters = useFiltersStore()

  return (
    <Card className="sticky top-24 rounded-2xl border border-slate-200/80 bg-white py-5 shadow-sm">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>Filtros</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={filters.reset}
            aria-label="Limpiar filtros"
          >
            <RotateCcw className="size-4" />
            Limpiar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-5">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Categorías</h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_ORDER.map((category) => (
              <FilterChip
                key={category}
                label={category}
                active={filters.category === category}
                onClick={() =>
                  filters.setCategory(
                    filters.category === category ? undefined : category
                  )
                }
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Bancos y fintechs</h3>
          <div className="flex flex-wrap gap-2">
            {walletProviders.map((provider) => (
              <FilterChip
                key={provider.slug}
                label={provider.label}
                active={filters.providerSlugs.includes(provider.slug)}
                onClick={() => filters.toggleProvider(provider.slug)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Medio de pago</h3>
          <div className="flex flex-wrap gap-2">
            {walletCardTypes.map((type) => (
              <FilterChip
                key={type.value}
                label={type.label}
                active={filters.paymentTypes.includes(type.value)}
                onClick={() => filters.togglePaymentType(type.value)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Canal</h3>
          <div className="flex flex-wrap gap-2">
            {CHANNEL_OPTIONS.map((channel) => (
              <FilterChip
                key={channel.value}
                label={channel.label}
                active={filters.channels.includes(channel.value)}
                onClick={() => filters.toggleChannel(channel.value)}
              />
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  )
}
