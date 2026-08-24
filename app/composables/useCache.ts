interface CachePayload<T> {
  timestamp: string
  value: T
}

const prefix = 'communityhub-cache:'

export function useCache() {
  const read = <T>(key: string): T | null => {
    if (!import.meta.client) {
      return null
    }

    const raw = window.localStorage.getItem(`${prefix}${key}`)
    if (!raw) {
      return null
    }

    try {
      return (JSON.parse(raw) as CachePayload<T>).value
    } catch {
      return null
    }
  }

  const write = <T>(key: string, value: T) => {
    if (!import.meta.client) {
      return
    }

    const payload: CachePayload<T> = {
      timestamp: new Date().toISOString(),
      value
    }

    window.localStorage.setItem(`${prefix}${key}`, JSON.stringify(payload))
  }

  return { read, write }
}
