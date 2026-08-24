<template>
  <section class="module-page">
    <header class="section-head">
      <div>
        <h1>Eventos</h1>
        <p>Consulta, filtra y administra actividades consumiendo el backend de CommunityHub.</p>
      </div>
      <button v-if="isOrganizer" type="button" class="button button-primary" @click="startCreate">
        Nuevo evento
      </button>
    </header>

    <section class="card module-page__filters">
      <div class="grid module-page__filters-grid">
        <label>
          <span>Buscar</span>
          <input v-model="filters.search" class="input" placeholder="Titulo o descripcion" />
        </label>
        <label>
          <span>Categoria</span>
          <select v-model="filters.category" class="select">
            <option value="">Todas</option>
            <option v-for="category in categories" :key="category._id" :value="category._id">
              {{ category.nombre }}
            </option>
          </select>
        </label>
        <label>
          <span>Ubicacion</span>
          <input v-model="filters.location" class="input" placeholder="San Jose, Heredia..." />
        </label>
        <label>
          <span>Fecha</span>
          <input v-model="filters.date" type="date" class="input" />
        </label>
      </div>

      <div class="module-page__toggles">
        <label><input v-model="filters.upcoming" type="checkbox" /> Solo proximos</label>
        <label><input v-model="filters.available" type="checkbox" /> Solo con cupos</label>
        <button type="button" class="button button-secondary" @click="applyFilters">Aplicar filtros</button>
      </div>
    </section>

    <section v-if="isOrganizer && editorOpen" class="card editor">
      <div class="section-head">
        <div>
          <h2>{{ editingId ? 'Editar evento' : 'Crear evento' }}</h2>
          <p>El formulario usa los campos validados por el backend.</p>
        </div>
        <button type="button" class="button button-secondary" @click="resetEditor">Cerrar</button>
      </div>

      <form class="grid editor__grid" @submit.prevent="submitEvent">
        <label>
          <span>Titulo</span>
          <input v-model="eventForm.titulo" class="input" required />
        </label>
        <label>
          <span>Categoria</span>
          <select v-model="eventForm.categoria" class="select" required>
            <option value="">Seleccione una categoria</option>
            <option v-for="category in categories" :key="category._id" :value="category._id">
              {{ category.nombre }}
            </option>
          </select>
        </label>
        <label>
          <span>Fecha</span>
          <input v-model="eventForm.fecha" type="date" class="input" required />
        </label>
        <label>
          <span>Hora</span>
          <input v-model="eventForm.hora" type="time" class="input" required />
        </label>
        <label>
          <span>Ubicacion</span>
          <input v-model="eventForm.ubicacion" class="input" required />
        </label>
        <label>
          <span>Capacidad maxima</span>
          <input v-model.number="eventForm.capacidadMaxima" type="number" min="1" class="input" required />
        </label>
        <label class="editor__full">
          <span>Descripcion</span>
          <textarea v-model="eventForm.descripcion" class="textarea" rows="4" required />
        </label>
        <label class="editor__full">
          <span>Imagen (URL opcional)</span>
          <input v-model="eventForm.imagen" class="input" />
        </label>

        <button type="submit" class="button button-primary">
          {{ editingId ? 'Guardar cambios' : 'Crear evento' }}
        </button>
      </form>
    </section>

    <div v-if="events.length" class="grid module-page__cards">
      <EventCard v-for="event in events" :key="event._id" :event="event">
        <button
          v-if="isLoggedIn"
          type="button"
          class="button button-secondary"
          @click="toggleFavorite(event._id)"
        >
          {{ favoriteIds.has(event._id) ? 'Quitar favorito' : 'Agregar favorito' }}
        </button>
        <button
          v-if="canRegister(event)"
          type="button"
          class="button button-primary"
          @click="toggleRegistration(event._id)"
        >
          {{ registrationEventIds.has(event._id) ? 'Cancelar inscripcion' : 'Inscribirme' }}
        </button>
        <button
          v-if="canManageEvent(event)"
          type="button"
          class="button button-secondary"
          @click="editEvent(event)"
        >
          Editar
        </button>
        <button
          v-if="canManageEvent(event)"
          type="button"
          class="button button-danger"
          @click="cancelCurrentEvent(event._id)"
        >
          Cancelar
        </button>
      </EventCard>
    </div>
    <div v-else class="empty-state card">No se encontraron eventos con los filtros actuales.</div>
  </section>
</template>

<script setup lang="ts">
import type { Category, Event } from '~/types/api'

definePageMeta({
  middleware: 'auth'
})

const auth = useAuth()
const { user, isOrganizer, isAdmin, isLoggedIn } = auth
const {
  events,
  categories,
  favorites,
  registrations,
  fetchEvents,
  fetchCategories,
  fetchFavorites,
  fetchRegistrations,
  createEvent,
  updateEvent,
  cancelEvent,
  registerToEvent,
  cancelRegistration,
  addFavorite,
  removeFavorite
} = useCommunityData()

const filters = reactive({
  search: '',
  category: '',
  location: '',
  date: '',
  upcoming: true,
  available: false
})

const editorOpen = ref(false)
const editingId = ref<string | null>(null)
const emptyForm = () => ({
  titulo: '',
  descripcion: '',
  categoria: '',
  fecha: '',
  hora: '',
  ubicacion: '',
  capacidadMaxima: 20,
  imagen: ''
})
const eventForm = reactive(emptyForm())

await Promise.all([
  fetchCategories(auth.isAdmin.value),
  fetchEvents({ upcoming: true }),
  fetchFavorites(),
  fetchRegistrations()
])

const favoriteIds = computed(() => new Set(favorites.value.map((item) => item.evento._id)))
const registrationEventIds = computed(() => new Set(registrations.value.map((item) => item.evento._id)))

const applyFilters = async () => {
  await fetchEvents({
    search: filters.search,
    category: filters.category,
    location: filters.location,
    date: filters.date,
    upcoming: filters.upcoming,
    available: filters.available
  })
}

const resetEditor = () => {
  Object.assign(eventForm, emptyForm())
  editingId.value = null
  editorOpen.value = false
}

const startCreate = () => {
  resetEditor()
  editorOpen.value = true
}

const editEvent = (event: Event) => {
  editingId.value = event._id
  editorOpen.value = true
  Object.assign(eventForm, {
    titulo: event.titulo,
    descripcion: event.descripcion,
    categoria: typeof event.categoria === 'string' ? event.categoria : (event.categoria as Category)._id,
    fecha: event.fecha.slice(0, 10),
    hora: event.hora,
    ubicacion: event.ubicacion,
    capacidadMaxima: event.capacidadMaxima,
    imagen: event.imagen || ''
  })
}

const submitEvent = async () => {
  const payload = {
    ...eventForm,
    imagen: eventForm.imagen || null
  }

  if (editingId.value) {
    await updateEvent(editingId.value, payload)
  } else {
    await createEvent(payload)
  }

  resetEditor()
  await applyFilters()
}

const canManageEvent = (event: Event) => {
  if (!user.value) return false
  if (isAdmin.value) return true
  return typeof event.organizador !== 'string' && event.organizador._id === user.value._id
}

const canRegister = (event: Event) => {
  if (!user.value) return false
  if (canManageEvent(event)) return false
  return event.estado === 'activo'
}

const toggleRegistration = async (eventId: string) => {
  if (registrationEventIds.value.has(eventId)) {
    await cancelRegistration(eventId)
  } else {
    await registerToEvent(eventId)
  }
}

const toggleFavorite = async (eventId: string) => {
  if (favoriteIds.value.has(eventId)) {
    await removeFavorite(eventId)
  } else {
    await addFavorite(eventId)
  }
}

const cancelCurrentEvent = async (eventId: string) => {
  await cancelEvent(eventId)
  await applyFilters()
}
</script>

<style scoped lang="scss">
.module-page {
  display: grid;
  gap: 1rem;

  &__filters,
  &__cards {
    gap: 1rem;
  }

  &__filters {
    padding: 1.1rem;
  }

  &__filters-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  &__toggles {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
    flex-wrap: wrap;
  }

  &__cards {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

.editor {
  padding: 1.2rem;

  &__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &__full {
    grid-column: 1 / -1;
  }

  label span {
    display: block;
    margin-bottom: 0.4rem;
    font-weight: 700;
  }
}

@media (max-width: 720px) {
  .editor__grid {
    grid-template-columns: 1fr;
  }
}
</style>
