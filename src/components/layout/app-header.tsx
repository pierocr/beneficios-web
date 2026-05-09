"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, WalletCards } from "lucide-react"

import { GoogleAuthButton } from "@/components/layout/google-auth-button"
import { Button } from "@/components/ui/button"
import { APP_NAME, APP_TAGLINE } from "@/lib/constants"
import { cn } from "@/lib/utils"

const navigation = [
  { href: "/", label: "Hoy" },
  { href: "/explorar", label: "Explorar" },
  { href: "/mapa", label: "Mapa" },
  { href: "/comparar", label: "Comparar" },
  { href: "/favoritos", label: "Favoritos" },
  { href: "/billetera", label: "Mi billetera" },
]

export function AppHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label={`${APP_NAME}, inicio`}>
          <span className="relative flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_12px_30px_rgba(15,23,42,0.16)]">
            <span className="absolute inset-1 rounded-xl border border-white/10" />
            <Search className="relative size-5" strokeWidth={2.5} />
          </span>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold tracking-tight text-slate-950">
              {APP_NAME}
            </div>
            <div className="text-xs text-slate-500">
              {APP_TAGLINE}
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

        <div className="hidden items-center gap-2 md:flex">
          <Button
            asChild
            className="rounded-full bg-emerald-600 px-4 text-white shadow-sm hover:bg-emerald-500"
          >
            <Link href="/billetera">
              <WalletCards className="size-4" />
              Ordenar por mi billetera
            </Link>
          </Button>
          <GoogleAuthButton />
        </div>

        <GoogleAuthButton compact className="md:hidden" />
      </div>
    </header>
  )
}
