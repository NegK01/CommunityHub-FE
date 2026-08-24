<template>
  <section class="module-page">
    <header class="section-head">
      <div>
        <h1>Inscripciones</h1>
        <p>Actividades activas en las que participa el usuario autenticado.</p>
      </div>
    </header>

    <div v-if="registrations.length" class="grid module-page__cards">
      <EventCard v-for="registration in registrations" :key="registration._id" :event="registration.evento">
        <button type="button" class="button button-danger" @click="cancelRegistration(registration.evento._id)">
          Cancelar inscripcion
        </button>
      </EventCard>
    </div>
    <div v-else class="empty-state card">No hay inscripciones activas registradas.</div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { registrations, fetchRegistrations, cancelRegistration } = useCommunityData()

await fetchRegistrations()
</script>

<style scoped lang="scss">
.module-page__cards {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
</style>
