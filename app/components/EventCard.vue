<template>
  <article class="event-card card">
    <div class="event-card__head">
      <div>
        <span
          v-if="categoryObject"
          class="badge"
          :style="{ backgroundColor: `${categoryObject.color || '#0f766e'}22`, color: categoryObject.color || '#0f766e' }"
        >
          {{ categoryObject.nombre }}
        </span>
        <h3>{{ event.titulo }}</h3>
      </div>
      <span class="badge badge-muted">{{ event.estado }}</span>
    </div>

    <p>{{ event.descripcion }}</p>

    <dl class="event-card__meta">
      <div>
        <dt>Fecha</dt>
        <dd>{{ formatDate(event.fecha) }} a las {{ event.hora }}</dd>
      </div>
      <div>
        <dt>Ubicacion</dt>
        <dd>{{ event.ubicacion }}</dd>
      </div>
      <div>
        <dt>Capacidad</dt>
        <dd>{{ event.capacidadMaxima }} cupos</dd>
      </div>
      <div>
        <dt>Disponibles</dt>
        <dd>{{ event.espaciosDisponibles ?? 'Sin dato' }}</dd>
      </div>
    </dl>

    <div class="event-card__actions">
      <slot />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Category, Event } from '~/types/api'

const props = defineProps<{
  event: Event
}>()

const categoryObject = computed(() => {
  return typeof props.event.categoria === 'string' ? null : (props.event.categoria as Category)
})

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('es-CR', {
    dateStyle: 'medium',
    timeZone: 'UTC'
  }).format(new Date(value))
</script>

<style scoped lang="scss">
.event-card {
  padding: 1.2rem;
  display: grid;
  gap: 1rem;

  h3,
  p {
    margin: 0;
  }

  p {
    color: var(--muted);
  }

  &__head,
  &__actions {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  &__meta {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.8rem;
    margin: 0;

    dt {
      color: var(--muted);
      font-size: 0.82rem;
    }

    dd {
      margin: 0.2rem 0 0;
      font-weight: 600;
    }
  }

  &__actions {
    flex-wrap: wrap;
  }
}
</style>
