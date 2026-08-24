<template>
  <section class="offline-page card">
    <span class="badge badge-warn">Modo offline</span>
    <h1>La aplicacion no pudo conectar con el backend.</h1>
    <p>
      Si ya visitaste la plataforma antes, CommunityHub intentará mostrar dashboard, eventos,
      categorías y notificaciones desde la caché local.
    </p>
    <NuxtLink :to="targetRoute" class="button button-primary">{{ targetLabel }}</NuxtLink>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const { online } = useNetwork()
const lastOnlineRoute = useState<string>('last-online-route', () => '/dashboard')
const targetRoute = computed(() => (online.value ? lastOnlineRoute.value || '/dashboard' : '/offline'))
const targetLabel = computed(() => (online.value ? 'Volver a la aplicacion' : 'Seguir en modo offline'))
</script>

<style scoped lang="scss">
.offline-page {
  padding: 2rem;
  align-self: center;

  h1 {
    margin: 1rem 0;
    font-family: var(--font-display);
  }

  p {
    color: var(--muted);
    margin-bottom: 1.5rem;
  }
}
</style>
