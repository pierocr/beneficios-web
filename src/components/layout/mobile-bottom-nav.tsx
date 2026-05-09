"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, Heart, Home, Map, Scale, WalletCards } from "lucide-react"

import { cn } from "@/lib/utils"

const navigation = [
  { href: "/", label: "Hoy", icon: Home },
  { href: "/explorar", label: "Explorar", icon: Compass },
  { href: "/mapa", label: "Mapa", icon: Map },
  { href: "/comparar", label: "Comparar", icon: Scale },
  { href: "/favoritos", label: "Favoritos", icon: Heart },
  { href: "/billetera", label: "Billetera", icon: WalletCards },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-4 bottom-4 z-40 md:hidden">
      <div className="grid grid-cols-6 rounded-[28px] border border-slate-200/80 bg-white/95 p-2 shadow-[0_20px_60px_rgba(15,23,42,0.16)] backdrop-blur-xl">
        {navigation.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-medium text-slate-500",
                isActive && "bg-slate-950 text-white"
              )}
              aria-label={item.label}
            >
              <item.icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
