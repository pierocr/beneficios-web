"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { ShieldCheck } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { walletCardTypes, walletProviders } from "@/features/wallet/wallet-options"
import { useWalletStore } from "@/stores/wallet-store"

const walletSchema = z.object({
  selectedProviders: z.array(z.string()),
  selectedCardTypes: z.array(z.string()).min(1, "Selecciona al menos un tipo"),
})

type WalletFormValues = z.infer<typeof walletSchema>

export function WalletPreferencesPanel() {
  const { selectedProviders, selectedCardTypes, setWallet, reset } = useWalletStore()

  const form = useForm<WalletFormValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      selectedProviders,
      selectedCardTypes,
    },
  })

  useEffect(() => {
    form.reset({ selectedProviders, selectedCardTypes })
  }, [form, selectedCardTypes, selectedProviders])

  const watchedProviders = useWatch({
    control: form.control,
    name: "selectedProviders",
  })
  const watchedCardTypes = useWatch({
    control: form.control,
    name: "selectedCardTypes",
  })

  function toggleArrayValue(
    field: "selectedProviders" | "selectedCardTypes",
    value: string
  ) {
    const current = form.getValues(field)
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
    form.setValue(field, next, { shouldDirty: true, shouldValidate: true })
  }

  return (
    <Card className="rounded-[32px] border border-slate-200/80 bg-white py-6 shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl">Personaliza tu billetera</CardTitle>
        <p className="text-sm leading-6 text-slate-600">
          Selecciona tus bancos, fintechs y tipos de tarjeta para ordenar mejor los beneficios.
        </p>
      </CardHeader>
      <CardContent className="space-y-8 px-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            Bancos y fintechs
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {walletProviders.map((provider) => {
              const active = watchedProviders.includes(provider.slug)

              return (
                <button
                  key={provider.slug}
                  type="button"
                  onClick={() => toggleArrayValue("selectedProviders", provider.slug)}
                  className={`rounded-[24px] border p-4 text-left transition ${
                    active
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <p className="font-semibold">{provider.label}</p>
                  <p className={`mt-1 text-sm ${active ? "text-slate-300" : "text-slate-500"}`}>
                    Usar para ordenar beneficios
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            Tipo de tarjeta
          </h3>
          <div className="flex flex-wrap gap-3">
            {walletCardTypes.map((cardType) => {
              const active = watchedCardTypes.includes(cardType.value)

              return (
                <button
                  key={cardType.value}
                  type="button"
                  onClick={() => toggleArrayValue("selectedCardTypes", cardType.value)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {cardType.label}
                </button>
              )
            })}
          </div>
          {form.formState.errors.selectedCardTypes && (
            <p className="text-sm text-red-600">
              {form.formState.errors.selectedCardTypes.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-[28px] bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 text-sm text-slate-600">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            <p>
              No pedimos numeros de tarjeta. Solo usamos esta informacion para ordenar beneficios.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full" onClick={reset}>
              Limpiar
            </Button>
            <Button
              className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
              onClick={form.handleSubmit((values) => setWallet(values))}
            >
              Guardar preferencias
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
