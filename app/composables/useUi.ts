type ToastKind = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  kind: ToastKind
  title: string
  message: string
}

export function useUi() {
  const toasts = useState<ToastItem[]>('ui-toasts', () => [])

  const pushToast = (kind: ToastKind, title: string, message: string) => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    toasts.value = [...toasts.value, { id, kind, title, message }]

    if (import.meta.client) {
      window.setTimeout(() => {
        toasts.value = toasts.value.filter((toast) => toast.id !== id)
      }, 4500)
    }
  }

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  return {
    toasts,
    pushToast,
    removeToast
  }
}
