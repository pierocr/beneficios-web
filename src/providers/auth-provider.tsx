"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Session, User } from "@supabase/supabase-js"

import {
  getSupabaseBrowserClient,
  isSupabaseAuthConfigured,
} from "@/lib/supabase-client"

type AuthStatus = "disabled" | "loading" | "authenticated" | "anonymous"

type AuthContextValue = {
  error: string | null
  isConfigured: boolean
  session: Session | null
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  status: AuthStatus
  user: User | null
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const isConfigured = isSupabaseAuthConfigured()
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<AuthStatus>(
    isConfigured ? "loading" : "disabled"
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()

    if (!supabase) {
      return
    }

    let isMounted = true

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!isMounted) return

      if (sessionError) {
        setError(sessionError.message)
      }

      setSession(data.session)
      setStatus(data.session ? "authenticated" : "anonymous")
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setStatus(nextSession ? "authenticated" : "anonymous")
      setError(null)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    const supabase = getSupabaseBrowserClient()

    if (!supabase) {
      setError("Configura Supabase Auth para habilitar el inicio de sesion.")
      return
    }

    setError(null)

    const currentPath = `${window.location.pathname}${window.location.search}`
    const next = encodeURIComponent(currentPath)
    const redirectTo = `${window.location.origin}/auth/callback?next=${next}`

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    })

    if (signInError) {
      setError(signInError.message)
    }
  }, [])

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient()

    if (!supabase) return

    setError(null)
    const { error: signOutError } = await supabase.auth.signOut()

    if (signOutError) {
      setError(signOutError.message)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      error,
      isConfigured,
      session,
      signInWithGoogle,
      signOut,
      status,
      user: session?.user ?? null,
    }),
    [error, isConfigured, session, signInWithGoogle, signOut, status]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}
