<template>
  <section class="module-page">
    <header class="section-head">
      <div>
        <h1>Favoritos</h1>
        <p>Eventos que el usuario guardó desde el módulo principal de actividades.</p>
      </div>
    </header>

    <div v-if="favorites.length" class="grid module-page__cards">
      <EventCard v-for="favorite in favorites" :key="favorite._id" :event="favorite.evento">
        <button type="button" class="button button-danger" @click="removeFavorite(favorite.evento._id)">
          Quitar de favoritos
        </button>
      </EventCard>
    </div>
    <div v-else class="empty-state card">Todavia no hay eventos marcados como favoritos.</div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { favorites, fetchFavorites, removeFavorite } = useCommunityData()

await fetchFavorites()
</script>

<style scoped lang="scss">
.module-page__cards {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
</style>
