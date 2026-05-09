"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { getSupabaseBrowserClient } from "@/lib/supabase-client"

function getSafeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/"
  }

  return value
}

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function completeSignIn() {
      const supabase = getSupabaseBrowserClient()
      const params = new URLSearchParams(window.location.search)
      const code = params.get("code")
      const next = getSafeNext(params.get("next"))

      if (!supabase) {
        router.replace(next)
        return
      }

      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
          setError(exchangeError.message)
          return
        }
      }

      router.replace(next)
    }

    completeSignIn()
  }, [router])

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-base font-semibold text-slate-950">
          Completando inicio de sesion
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {error
            ? "No pudimos completar el inicio de sesion. Intentalo nuevamente."
            : "Estamos validando tu cuenta de Google."}
        </p>
        {error ? (
          <p className="mt-3 text-xs text-red-600">{error}</p>
        ) : null}
      </div>
    </main>
  )
}
