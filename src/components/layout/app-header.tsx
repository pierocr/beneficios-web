"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Landmark, WalletCards } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { href: "/", label: "Hoy" },
  { href: "/explorar", label: "Explorar" },
  { href: "/comparar", label: "Comparar" },
  { href: "/favoritos", label: "Favoritos" },
  { href: "/billetera", label: "Mi billetera" },
]

export function AppHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_12px_30px_rgba(15,23,42,0.16)]">
            <Landmark className="size-5" />
          </span>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold tracking-tight text-slate-950">
              Beneficios Chile
            </div>
            <div className="text-xs text-slate-500">
              Comparador bancario y fintech
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950",
                  isActive && "bg-slate-950 text-white hover:bg-slate-900 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <Button
          asChild
          className="hidden rounded-full bg-emerald-600 px-4 text-white shadow-sm hover:bg-emerald-500 md:inline-flex"
        >
          <Link href="/billetera">
            <WalletCards className="size-4" />
            Ordenar por mi billetera
          </Link>
        </Button>
      </div>
    </header>
  )
}
