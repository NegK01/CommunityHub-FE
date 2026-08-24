import type { AuthResponse, User } from '~/types/api'

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload extends LoginPayload {
  nombre: string
  apellido: string
  fotoPerfil?: string | null
}

const tokenKey = 'communityhub-auth-token'
const userKey = 'communityhub-auth-user'

export function useAuth() {
  const token = useState<string | null>('auth-token', () => null)
  const user = useState<User | null>('auth-user', () => null)
  const initialized = useState<boolean>('auth-initialized', () => false)
  const loading = useState<boolean>('auth-loading', () => false)
  const api = useApi()
  const { pushToast } = useUi()

  const persist = () => {
    if (!import.meta.client) {
      return
    }

    if (token.value) {
      window.localStorage.setItem(tokenKey, token.value)
    } else {
      window.localStorage.removeItem(tokenKey)
    }

    if (user.value) {
      window.localStorage.setItem(userKey, JSON.stringify(user.value))
    } else {
      window.localStorage.removeItem(userKey)
    }
  }

  const setSession = (nextToken: string, nextUser: User) => {
    token.value = nextToken
    user.value = nextUser
    persist()
  }

  const clearSession = () => {
    token.value = null
    user.value = null
    persist()
  }

  const bootstrap = async () => {
    if (initialized.value) {
      return
    }

    if (import.meta.client) {
      token.value = window.localStorage.getItem(tokenKey)
      const rawUser = window.localStorage.getItem(userKey)

      if (rawUser) {
        try {
          user.value = JSON.parse(rawUser) as User
        } catch {
          user.value = null
        }
      }
    }

    if (token.value) {
      try {
        const response = await api.request<{ user: User }>('/auth/me')
        user.value = response.user
        persist()
      } catch {
        clearSession()
      }
    }

    initialized.value = true
  }

  const login = async (payload: LoginPayload) => {
    loading.value = true
    try {
      const response = await api.request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: payload
      })

      setSession(response.token, response.user)
      pushToast('success', 'Sesion iniciada', `Bienvenido de nuevo, ${response.user.nombre}.`)
      await navigateTo('/dashboard')
    } finally {
      loading.value = false
    }
  }

  const register = async (payload: RegisterPayload) => {
    loading.value = true
    try {
      const response = await api.request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: payload
      })

      setSession(response.token, response.user)
      pushToast('success', 'Cuenta creada', 'Tu cuenta fue registrada correctamente.')
      await navigateTo('/dashboard')
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    if (token.value) {
      try {
        await api.request('/auth/logout', { method: 'POST' })
      } catch {
      }
    }

    clearSession()
    pushToast('info', 'Sesion cerrada', 'Tu sesion se cerro correctamente.')
    await navigateTo('/login')
  }

  const patchUser = (nextUser: User) => {
    user.value = nextUser
    persist()
  }

  return {
    token,
    user,
    initialized,
    loading,
    isLoggedIn: computed(() => Boolean(token.value)),
    isAdmin: computed(() => user.value?.rol === 'admin'),
    isOrganizer: computed(() => ['admin', 'organizer'].includes(user.value?.rol || '')),
    bootstrap,
    login,
    register,
    logout,
    clearSession,
    patchUser
  }
}
