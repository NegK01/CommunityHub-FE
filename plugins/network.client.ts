export default defineNuxtPlugin(() => {
  const { online, syncFromNavigator } = useNetwork()
  const { pushToast } = useUi()
  const route = useRoute()
  const lastOnlineRoute = useState<string>('last-online-route', () => '/dashboard')

  const redirectToOffline = async () => {
    if (route.path !== '/offline') {
      lastOnlineRoute.value = route.fullPath
      await navigateTo('/offline')
    }
  }

  const onOnline = async () => {
    syncFromNavigator()
    pushToast('success', 'Conexion restablecida', 'La aplicacion volvio a estar en linea.')

    if (route.path === '/offline') {
      await navigateTo(lastOnlineRoute.value || '/dashboard')
    }
  }

  const onOffline = async () => {
    syncFromNavigator()
    pushToast('info', 'Modo offline', 'Se mostrara la pantalla offline mientras no haya conexion.')
    await redirectToOffline()
  }

  if (import.meta.client) {
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    online.value = window.navigator.onLine

    if (online.value && route.path !== '/offline') {
      lastOnlineRoute.value = route.fullPath
    }

    watch(
      () => route.fullPath,
      (path) => {
        if (online.value && route.path !== '/offline') {
          lastOnlineRoute.value = path
        }
      },
      { immediate: true }
    )

    if (!online.value) {
      void redirectToOffline()
    }
  }
})
