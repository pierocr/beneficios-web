import { ExternalLink, Eye, RefreshCw } from "lucide-react"

export function TransparencySection() {
  return (
    <section className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-sm md:p-8">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Transparencia</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
          Fuente original, actualización y condiciones claras
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-600">
          La interfaz prioriza lo que normalmente queda escondido: topes, medio de pago, vigencia y claridad de la fuente. Si una promoción cambia o genera dudas, lo marcamos.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-[26px] bg-slate-50 p-5">
          <ExternalLink className="size-5 text-slate-700" />
          <h3 className="mt-4 text-lg font-semibold text-slate-950">Fuente original</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Cada ficha deja lista la URL oficial para contrastar la promoción directamente.
          </p>
        </article>
        <article className="rounded-[26px] bg-slate-50 p-5">
          <RefreshCw className="size-5 text-slate-700" />
          <h3 className="mt-4 text-lg font-semibold text-slate-950">Actualización visible</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Mostramos fecha de última revisión y señal de confianza para bajar incertidumbre.
          </p>
        </article>
        <article className="rounded-[26px] bg-slate-50 p-5">
          <Eye className="size-5 text-slate-700" />
          <h3 className="mt-4 text-lg font-semibold text-slate-950">Condiciones escaneables</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Nada de esconder topes o canales. Lo crítico aparece primero para decidir rápido.
          </p>
        </article>
      </div>
    </section>
  )
}
