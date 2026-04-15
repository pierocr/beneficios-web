import { CalendarDays, CreditCard, RadioTower, Wallet } from "lucide-react"

import { formatBenefitValue, formatCurrencyCLP } from "@/lib/formatters"
import { Benefit } from "@/types/benefit"

export function BenefitDetailHero({ benefit }: { benefit: Benefit }) {
  return (
    <section className="rounded-[32px] border border-slate-200/80 bg-[linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95)_45%,_rgba(49,46,129,0.92)_100%)] p-6 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] md:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-300">
            {benefit.bankName} · {benefit.categoryName}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            {formatBenefitValue(benefit)}
          </h1>
          <div>
            <p className="text-xl font-semibold">{benefit.merchantName}</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              {benefit.title}
            </p>
          </div>
        </div>

        <div className="grid gap-3 rounded-[28px] border border-white/10 bg-white/6 p-5 text-sm text-slate-100">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-emerald-300" />
            <span>{benefit.days.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="size-4 text-emerald-300" />
            <span>{benefit.paymentMethods.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2">
            <RadioTower className="size-4 text-emerald-300" />
            <span className="capitalize">{benefit.channel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="size-4 text-emerald-300" />
            <span>Tope {formatCurrencyCLP(benefit.capAmount)}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
