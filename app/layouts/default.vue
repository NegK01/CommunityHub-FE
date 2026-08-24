<template>
  <div class="page-shell dashboard-layout">
    <div class="dashboard-layout__grid container">
      <AppSidebar />
      <main class="dashboard-layout__main">
        <AppHeader />
        <div v-if="!online" class="offline-banner card">
          Estás navegando sin conexión. Se muestran datos cacheados cuando están disponibles.
        </div>
        <slot />
      </main>
    </div>
    <AppToastList />
  </div>
</template>

<script setup lang="ts">
const { online } = useNetwork()
</script>

<style scoped lang="scss">
.dashboard-layout {
  padding: 1rem 0;

  &__grid {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 1rem;
  }

  &__main {
    min-width: 0;
  }
}

.offline-banner {
  padding: 1rem 1.2rem;
  margin-bottom: 1rem;
  color: #fdba74;
  background: rgba(120, 53, 15, 0.22);
}

@media (max-width: 960px) {
  .dashboard-layout__grid {
    grid-template-columns: 1fr;
  }
}
</style>
