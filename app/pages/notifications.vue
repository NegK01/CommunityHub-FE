<template>
  <section class="module-page">
    <header class="section-head">
      <div>
        <h1>Notificaciones</h1>
        <p>Seguimiento de avisos del backend, con marcado individual y masivo.</p>
      </div>
      <button type="button" class="button button-secondary" @click="markAllNotificationsRead">
        Marcar todas como leidas
      </button>
    </header>

    <div v-if="notifications.length" class="grid">
      <article
        v-for="notification in notifications"
        :key="notification._id"
        class="card notification-card"
        :class="{ 'notification-card--read': notification.leida }"
      >
        <div class="notification-card__head">
          <div>
            <span class="badge badge-primary">{{ notification.tipo }}</span>
            <h3>{{ notification.titulo }}</h3>
          </div>
          <small>{{ formatDate(notification.createdAt) }}</small>
        </div>
        <p>{{ notification.mensaje }}</p>
        <p v-if="notification.evento" class="notification-card__event">
          Evento relacionado: {{ notification.evento.titulo }}
        </p>
        <button
          v-if="!notification.leida"
          type="button"
          class="button button-primary"
          @click="markNotificationRead(notification._id)"
        >
          Marcar como leida
        </button>
      </article>
    </div>
    <div v-else class="empty-state card">No hay notificaciones disponibles.</div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { notifications, fetchNotifications, markNotificationRead, markAllNotificationsRead } = useCommunityData()

await fetchNotifications()

const formatDate = (value?: string) => {
  if (!value) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-CR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value))
}
</script>

<style scoped lang="scss">
.notification-card {
  padding: 1.2rem;
  display: grid;
  gap: 0.9rem;

  &--read {
    opacity: 0.72;
  }

  &__head {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  h3,
  p {
    margin: 0;
  }

  p,
  small {
    color: var(--muted);
  }

  &__event {
    font-weight: 700;
    color: var(--text);
  }
}
</style>
