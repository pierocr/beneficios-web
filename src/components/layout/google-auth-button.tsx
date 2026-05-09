"use client"

import { LogIn, LogOut, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth-provider"
import { cn } from "@/lib/utils"

function getDisplayName(userName?: string, email?: string) {
  return userName || email?.split("@")[0] || "Cuenta"
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function GoogleAuthButton({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  const { isConfigured, signInWithGoogle, signOut, status, user } = useAuth()

  if (!isConfigured) {
    return (
      <Button
        type="button"
        variant="outline"
        size={compact ? "icon-lg" : "default"}
        className={cn(
          "rounded-full border-slate-200 bg-white text-slate-400 shadow-sm",
          !compact && "px-4",
          className
        )}
        disabled
        aria-label="Configura Supabase para iniciar sesion con Google"
        title="Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY"
      >
        <LogIn className="size-4" />
        {compact ? null : "Iniciar sesion"}
      </Button>
    )
  }

  if (status === "loading") {
    return (
      <div
        className={cn(
          "h-9 animate-pulse rounded-full bg-slate-100",
          compact ? "w-9" : "w-28",
          className
        )}
        aria-label="Cargando sesion"
      />
    )
  }

  if (!user) {
    return (
      <Button
        type="button"
        variant="outline"
        size={compact ? "icon-lg" : "default"}
        className={cn(
          "rounded-full border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-950",
          !compact && "px-4",
          className
        )}
        onClick={signInWithGoogle}
        aria-label="Iniciar sesion con Google"
        title="Iniciar sesion con Google"
      >
        <LogIn className="size-4" />
        {compact ? null : "Iniciar sesion"}
      </Button>
    )
  }

  const displayName = getDisplayName(
    user.user_metadata?.full_name,
    user.email ?? undefined
  )

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 shadow-sm",
        compact ? "pr-1" : "pr-2",
        className
      )}
    >
      <span className="flex size-8 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
        {displayName ? getInitials(displayName) : <UserRound className="size-4" />}
      </span>
      {compact ? null : (
        <span className="max-w-28 truncate text-sm font-medium text-slate-700">
          {displayName}
        </span>
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="rounded-full text-slate-500 hover:text-slate-950"
        onClick={signOut}
        aria-label="Cerrar sesion"
        title="Cerrar sesion"
      >
        <LogOut className="size-4" />
      </Button>
    </div>
  )
}
