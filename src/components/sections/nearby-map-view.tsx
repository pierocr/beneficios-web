"use client"

import { useMemo, useState } from "react"
import { Layers, LocateFixed, MapPin, Navigation, Route } from "lucide-react"

import { BenefitCard } from "@/components/benefits/benefit-card"
import { Button } from "@/components/ui/button"
import { getBenefitPercentageValue } from "@/features/benefits/ranking"
import { Benefit } from "@/types/benefit"

type LocationStatus = "idle" | "loading" | "ready" | "denied" | "unsupported"

const pins = [
  { top: "18%", left: "24%", label: "50%" },
  { top: "28%", left: "58%", label: "40%" },
  { top: "42%", left: "38%", label: "35%" },
  { top: "56%", left: "68%", label: "45%" },
  { top: "70%", left: "30%", label: "30%" },
]

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function isRelevantForNearby(benefit: Benefit) {
  const channelMatches = benefit.channel === "presencial" || benefit.channel === "ambos"
  const regionMatches =
    !benefit.regions?.length ||
    benefit.regions.some((region) =>
      ["nacional", "metropolitana"].includes(normalizeText(region))
    )

  return channelMatches && regionMatches && getBenefitPercentageValue(benefit) > 0
}

export function NearbyMapView({ benefits }: { benefits: Benefit[] }) {
  const [status, setStatus] = useState<LocationStatus>("idle")
  const [coords, setCoords] = useState<GeolocationCoordinates | null>(null)
  const nearbyBenefits = useMemo(
    () =>
      benefits
        .filter(isRelevantForNearby)
        .sort(
          (left, right) =>
            getBenefitPercentageValue(right) - getBenefitPercentageValue(left)
        )
        .slice(0, 18),
    [benefits]
  )

  function requestLocation() {
    if (!("geolocation" in navigator)) {
      setStatus("unsupported")
      return
    }

    setStatus("loading")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords(position.coords)
        setStatus("ready")
      },
      () => setStatus("denied"),
      { enableHighAccuracy: true, maximumAge: 1000 * 60 * 5, timeout: 10000 }
    )
  }

  const statusLabel =
    status === "ready"
      ? "Ubicación activa"
      : status === "loading"
        ? "Buscando ubicación..."
        : status === "denied"
          ? "Permiso de ubicación no disponible"
          : status === "unsupported"
            ? "Tu navegador no soporta ubicación"
            : "Ubicación pendiente"

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="min-h-[640px] overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col justify-between gap-5 border-b border-slate-100 p-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
              Mapa de descuentos
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Descuentos cerca de ti
            </h1>
          </div>
          <Button
            onClick={requestLocation}
            disabled={status === "loading"}
            className="h-11 rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800"
          >
            <LocateFixed className="size-4" />
            {status === "loading" ? "Ubicando..." : "Usar mi ubicación"}
          </Button>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="relative min-h-[470px] overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,_#e8f4ef_0%,_#f8fafc_44%,_#e7eef8_100%)]">
            <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />
            <div className="absolute inset-x-10 top-1/2 h-24 -translate-y-1/2 rounded-full border-y-8 border-white/80" />
            <div className="absolute top-10 bottom-10 left-1/2 w-24 -translate-x-1/2 rounded-full border-x-8 border-white/75" />
            <div className="absolute top-[18%] right-[14%] bottom-[22%] left-[16%] rounded-[40%] border-8 border-white/60" />

            <div className="absolute top-5 left-5 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
              <Layers className="size-4 text-emerald-700" />
              Vista preliminar
            </div>
            <div className="absolute right-5 bottom-5 left-5 rounded-3xl bg-slate-950/90 p-4 text-white shadow-[0_18px_50px_rgba(15,23,42,0.24)] backdrop-blur">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-emerald-950">
                  <Navigation className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">{statusLabel}</p>
                  <p className="mt-1 text-sm text-slate-300">
                    {coords
                      ? `Lat ${coords.latitude.toFixed(4)}, lng ${coords.longitude.toFixed(4)}`
                      : "Cuando conectemos locales georreferenciados, este mapa ordenará descuentos por distancia real."}
                  </p>
                </div>
              </div>
            </div>

            {pins.map((pin) => (
              <div
                key={`${pin.top}-${pin.left}`}
                className="absolute"
                style={{ top: pin.top, left: pin.left }}
              >
                <div className="relative">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/30" />
                  <span className="relative flex h-12 min-w-14 items-center justify-center rounded-full bg-emerald-600 px-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(5,150,105,0.32)]">
                    {pin.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <aside className="space-y-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                <Route className="size-4 text-emerald-700" />
                Próximo paso técnico
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Agregar latitud/longitud por sucursal o comercio, guardar radio de búsqueda y ordenar por distancia.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                <MapPin className="size-4 text-emerald-700" />
                Fuente actual
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Mientras no existan coordenadas, se priorizan descuentos presenciales o mixtos con cobertura nacional o metropolitana.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <aside className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Cerca de ti
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Descuentos destacados
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Lista inicial para alimentar el mapa mientras se incorporan coordenadas por local.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {nearbyBenefits.map((benefit) => (
            <BenefitCard key={benefit.id} benefit={benefit} variant="compact" />
          ))}
        </div>
      </aside>
    </div>
  )
}
