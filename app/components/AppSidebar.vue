<template>
  <aside class="sidebar card">
    <div class="sidebar__brand">
      <span>CH</span>
      <div>
        <strong>CommunityHub</strong>
        <small>Plataforma comunitaria</small>
      </div>
    </div>

    <nav class="sidebar__nav">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="sidebar__link"
        active-class="sidebar__link--active"
      >
        <span>{{ item.label }}</span>
        <small>{{ item.caption }}</small>
      </NuxtLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const { user } = useAuth()

const items = computed(() => {
  const base = [
    { to: '/dashboard', label: 'Dashboard', caption: 'Resumen general' },
    { to: '/events', label: 'Eventos', caption: 'Catalogo y gestion' },
    { to: '/categories', label: 'Categorias', caption: 'Taxonomia del sistema' },
    { to: '/notifications', label: 'Notificaciones', caption: 'Avisos y seguimiento' },
    { to: '/favorites', label: 'Favoritos', caption: 'Eventos guardados' },
    { to: '/registrations', label: 'Inscripciones', caption: 'Tus actividades' },
    { to: '/profile', label: 'Perfil', caption: 'Cuenta y preferencias' }
  ]

  if (user.value?.rol === 'admin') {
    base.splice(3, 0, { to: '/users', label: 'Usuarios', caption: 'Administracion y roles' })
  }

  return base
})
</script>

<style scoped lang="scss">
.sidebar {
  position: sticky;
  top: 1rem;
  padding: 1.2rem;
  height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  &__brand {
    display: flex;
    align-items: center;
    gap: 0.85rem;

    span {
      width: 3rem;
      height: 3rem;
      display: grid;
      place-items: center;
      border-radius: 18px;
      background: linear-gradient(135deg, var(--primary), #2dd4bf);
      color: #fff;
      font-weight: 800;
    }

    strong,
    small {
      display: block;
    }

    small {
      color: var(--muted);
    }
  }

  &__nav {
    display: grid;
    gap: 0.55rem;
  }

  &__link {
    padding: 0.9rem 1rem;
    border-radius: 18px;
    background: rgba(15, 23, 42, 0.72);
    transition: background-color 0.2s ease, transform 0.2s ease;

    span,
    small {
      display: block;
    }

    small {
      margin-top: 0.2rem;
      color: var(--muted);
    }

    &:hover,
    &--active {
      background: rgba(15, 118, 110, 0.2);
      transform: translateX(2px);
    }
  }
}

@media (max-width: 960px) {
  .sidebar {
    position: static;
    height: auto;
  }
}
</style>
