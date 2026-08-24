<template>
  <header class="app-header card">
    <div>
      <p class="app-header__eyebrow">Estado de la aplicacion</p>
      <div class="app-header__status">
        <span class="badge" :class="online ? 'badge-primary' : 'badge-warn'">
          {{ online ? 'En linea' : 'Offline con cache' }}
        </span>
        <span class="badge badge-muted">{{ user?.rol || 'visitante' }}</span>
      </div>
    </div>

    <div class="app-header__actions">
      <div class="app-header__user">
        <strong>{{ user ? `${user.nombre} ${user.apellido}` : 'Invitado' }}</strong>
        <small>{{ user?.email }}</small>
      </div>
      <button type="button" class="button button-secondary" @click="logout">
        Cerrar sesion
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
const { online } = useNetwork()
</script>

<style scoped lang="scss">
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 1.3rem;
  margin-bottom: 1rem;

  &__eyebrow {
    margin: 0 0 0.45rem;
    color: var(--muted);
    font-size: 0.9rem;
  }

  &__status,
  &__actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__user {
    text-align: right;

    strong,
    small {
      display: block;
    }

    small {
      color: var(--muted);
    }
  }
}

@media (max-width: 720px) {
  .app-header {
    align-items: stretch;
    flex-direction: column;

    &__actions {
      width: 100%;
      justify-content: space-between;
    }
  }
}
</style>
