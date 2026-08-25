import type {
  Category,
  DashboardData,
  Event,
  Favorite,
  NotificationItem,
  Registration,
  User
} from '~/types/api'

interface EventFilters {
  search?: string
  category?: string
  location?: string
  date?: string
  upcoming?: boolean
  available?: boolean
  organizer?: string
  all?: boolean
  status?: string
}

const toQueryString = (filters: Record<string, string | boolean | undefined>) => {
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === '') {
      return
    }

    params.set(key, String(value))
  })

  const query = params.toString()
  return query ? `?${query}` : ''
}

export function useCommunityData() {
  const api = useApi()

  const dashboard = useState<DashboardData | null>('dashboard-data', () => null)
  const events = useState<Event[]>('events-data', () => [])
  const categories = useState<Category[]>('categories-data', () => [])
  const notifications = useState<NotificationItem[]>('notifications-data', () => [])
  const users = useState<User[]>('users-data', () => [])
  const favorites = useState<Favorite[]>('favorites-data', () => [])
  const registrations = useState<Registration[]>('registrations-data', () => [])

  const fetchDashboard = async () => {
    dashboard.value = await api.request<DashboardData>('/dashboard', { cacheKey: 'dashboard' })
    return dashboard.value
  }

  const fetchEvents = async (filters: EventFilters = {}) => {
    const query = toQueryString({
      search: filters.search,
      category: filters.category,
      location: filters.location,
      date: filters.date ? filters.date.split('T')[0] : undefined,
      upcoming: filters.upcoming,
      available: filters.available,
      organizer: filters.organizer,
      status: filters.status,
      all: filters.all
    })

    events.value = await api.request<Event[]>(`/events${query}`, { cacheKey: `events:${query || 'all'}` })
    return events.value
  }

  const fetchCategories = async (includeAll = false) => {
    const query = includeAll ? '?all=true' : ''
    categories.value = await api.request<Category[]>(`/categories${query}`, {
      cacheKey: `categories:${includeAll ? 'all' : 'active'}`
    })
    return categories.value
  }

  const fetchNotifications = async () => {
    notifications.value = await api.request<NotificationItem[]>('/notifications', { cacheKey: 'notifications' })
    return notifications.value
  }

  const fetchUsers = async (filters: { search?: string; rol?: string } = {}) => {
    const query = toQueryString(filters)
    users.value = await api.request<User[]>(`/users${query}`, { cacheKey: `users:${query || 'all'}` })
    return users.value
  }

  const fetchFavorites = async () => {
    favorites.value = await api.request<Favorite[]>('/users/me/favorites', { cacheKey: 'favorites' })
    return favorites.value
  }

  const fetchRegistrations = async () => {
    registrations.value = await api.request<Registration[]>('/users/me/registrations', {
      cacheKey: 'registrations'
    })
    return registrations.value
  }

  const createEvent = async (payload: Record<string, unknown>) => {
    await api.request<Event>('/events', { method: 'POST', body: payload })
    await fetchEvents()
  }

  const updateEvent = async (eventId: string, payload: Record<string, unknown>) => {
    await api.request<Event>(`/events/${eventId}`, { method: 'PUT', body: payload })
    await fetchEvents()
  }

  const cancelEvent = async (eventId: string) => {
    await api.request(`/events/${eventId}`, { method: 'DELETE' })
    await fetchEvents()
  }

  const createCategory = async (payload: Record<string, unknown>) => {
    await api.request<Category>('/categories', { method: 'POST', body: payload })
    await fetchCategories(true)
  }

  const updateCategory = async (categoryId: string, payload: Record<string, unknown>) => {
    await api.request<Category>(`/categories/${categoryId}`, { method: 'PUT', body: payload })
    await fetchCategories(true)
  }

  const disableCategory = async (categoryId: string) => {
    await api.request(`/categories/${categoryId}`, { method: 'DELETE' })
    await fetchCategories(true)
  }

  const markNotificationRead = async (notificationId: string) => {
    await api.request(`/notifications/${notificationId}/read`, { method: 'PATCH' })
    await fetchNotifications()
  }

  const markAllNotificationsRead = async () => {
    await api.request('/notifications/read-all', { method: 'PATCH' })
    await fetchNotifications()
  }

  const updateUser = async (userId: string, payload: Record<string, unknown>) => {
    const updated = await api.request<User>(`/users/${userId}`, { method: 'PUT', body: payload })
    await fetchUsers()
    return updated
  }

  const deleteUser = async (userId: string) => {
    await api.request(`/users/${userId}`, { method: 'DELETE' })
    await fetchUsers()
  }

  const registerToEvent = async (eventId: string) => {
    await api.request(`/events/${eventId}/register`, { method: 'POST' })
    await Promise.all([fetchEvents(), fetchRegistrations(), fetchDashboard()])
  }

  const cancelRegistration = async (eventId: string) => {
    await api.request(`/events/${eventId}/register`, { method: 'DELETE' })
    await Promise.all([fetchEvents(), fetchRegistrations(), fetchDashboard()])
  }

  const addFavorite = async (eventId: string) => {
    await api.request(`/events/${eventId}/favorite`, { method: 'POST' })
    await Promise.all([fetchFavorites(), fetchDashboard()])
  }

  const removeFavorite = async (eventId: string) => {
    await api.request(`/events/${eventId}/favorite`, { method: 'DELETE' })
    await Promise.all([fetchFavorites(), fetchDashboard()])
  }

  return {
    dashboard,
    events,
    categories,
    notifications,
    users,
    favorites,
    registrations,
    fetchDashboard,
    fetchEvents,
    fetchCategories,
    fetchNotifications,
    fetchUsers,
    fetchFavorites,
    fetchRegistrations,
    createEvent,
    updateEvent,
    cancelEvent,
    createCategory,
    updateCategory,
    disableCategory,
    markNotificationRead,
    markAllNotificationsRead,
    updateUser,
    deleteUser,
    registerToEvent,
    cancelRegistration,
    addFavorite,
    removeFavorite
  }
}
