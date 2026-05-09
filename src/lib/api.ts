export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

type ApiFetchInit = RequestInit & {
  next?: {
    revalidate?: number | false
  }
}

export async function apiFetch<T>(path: string, init?: ApiFetchInit): Promise<T> {
  const cacheMode = init?.cache ?? "no-store"
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: cacheMode,
    ...(cacheMode === "no-store" ? {} : { next: { revalidate: 60, ...(init?.next || {}) } }),
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}
