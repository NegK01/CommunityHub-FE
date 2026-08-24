import type { ApiSuccess } from '~/types/api'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface RequestOptions<T> {
  method?: HttpMethod
  body?: Record<string, unknown>
  cacheKey?: string
  offlineFallback?: T
}

export function useApi() {
  const config = useRuntimeConfig()
  const token = useState<string | null>('auth-token', () => null)
  const { online } = useNetwork()
  const { pushToast } = useUi()
  const { read, write } = useCache()

  const request = async <T>(path: string, options: RequestOptions<T> = {}): Promise<T> => {
    const method = options.method || 'GET'

    try {
      const response = await $fetch<ApiSuccess<T>>(`${config.public.apiBaseUrl}${path}`, {
        method,
        body: options.body,
        headers: token.value
          ? {
              Authorization: `Bearer ${token.value}`
            }
          : undefined
      })

      if (method === 'GET' && options.cacheKey) {
        write(options.cacheKey, response.data)
      }

      online.value = true
      return response.data
    } catch (error: any) {
      const statusCode = error?.statusCode || error?.response?.status
      const message = error?.data?.message || error?.message || 'No fue posible completar la solicitud.'
      const browserOnline = import.meta.client ? window.navigator.onLine : online.value

      online.value = browserOnline

      if (method === 'GET' && options.cacheKey) {
        const cached = read<T>(options.cacheKey)
        if (cached) {
          return cached
        }
      }

      if (!browserOnline && options.offlineFallback !== undefined) {
        return options.offlineFallback
      }

      pushToast('error', 'Operacion fallida', message)
      throw createError({ statusCode: statusCode || 500, statusMessage: message })
    }
  }

  return { request }
}
