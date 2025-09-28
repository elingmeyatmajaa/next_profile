export interface FetchOptions extends RequestInit {
  token?: string | null
}

export async function apiFetch<T = any>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, headers, ...rest } = options

  const res = await fetch(url, {
    ...rest,
    headers: {
      ...(headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Accept-Language": "en",
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || `API error: ${res.status}`)
  }

  return res.json()
}
