export function useNetwork() {
  const online = useState<boolean>('network-online', () => true)

  const syncFromNavigator = () => {
    if (import.meta.client) {
      online.value = window.navigator.onLine
    }
  }

  return {
    online,
    syncFromNavigator
  }
}
