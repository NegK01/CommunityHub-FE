<template>
  <section>
    <header class="section-head">
      <div>
        <h1>Dashboard</h1>
        <p>Resumen central según el rol autenticado y con soporte de caché para modo offline.</p>
      </div>
      <button type="button" class="button button-secondary" @click="refreshAll">Actualizar</button>
    </header>

    <div v-if="dashboard" class="grid grid-stats">
      <template v-if="dashboard.rol === 'user'">
        <StatCard title="Inscripciones activas" :value="dashboard.resumen.totalInscripciones" caption="Eventos donde participa el usuario" />
        <StatCard title="Favoritos" :value="dashboard.resumen.totalFavoritos" caption="Actividades guardadas" />
        <StatCard title="Pendientes" :value="dashboard.resumen.notificacionesNoLeidas" caption="Notificaciones sin leer" />
      </template>

      <template v-else-if="dashboard.rol === 'organizer'">
        <StatCard title="Actividades" :value="dashboard.resumen.totalActividades" caption="Eventos creados por el organizador" />
        <StatCard title="Activas" :value="dashboard.resumen.actividadesActivas" caption="Disponibles para la comunidad" />
        <StatCard title="Participantes" :value="dashboard.resumen.totalParticipantes" caption="Asistentes contabilizados" />
      </template>

      <template v-else>
        <StatCard title="Usuarios" :value="dashboard.resumen.usuarios.total" caption="Cuentas registradas en el sistema" />
        <StatCard title="Eventos" :value="dashboard.resumen.actividades.total" caption="Total de actividades creadas" />
        <StatCard title="Categorias" :value="dashboard.resumen.totalCategorias" caption="Taxonomias disponibles" />
      </template>
    </div>

    <div class="grid grid-panels dashboard-panels">
      <section class="card dashboard-panels__main">
        <div class="section-head">
          <div>
            <h2>{{ dashboardTitle }}</h2>
            <p>{{ dashboardSubtitle }}</p>
          </div>
        </div>

        <div v-if="dashboard?.rol === 'user'">
          <div v-if="dashboard.proximasActividades.length" class="grid">
            <EventCard
              v-for="registration in dashboard.proximasActividades"
              :key="registration._id"
              :event="registration.evento"
            />
          </div>
          <div v-else class="empty-state">No hay actividades proximas para este usuario.</div>
        </div>

        <div v-else-if="dashboard?.rol === 'organizer'">
          <div v-if="dashboard.proximasActividades.length" class="grid">
            <EventCard v-for="event in dashboard.proximasActividades" :key="event._id" :event="event" />
          </div>
          <div v-else class="empty-state">No hay actividades activas proximas creadas por este organizador.</div>
        </div>

        <div v-else-if="dashboard?.rol === 'admin'" class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Indicador</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Organizadores</td>
                <td>{{ dashboard.resumen.usuarios.organizadores }}</td>
              </tr>
              <tr>
                <td>Usuarios comunes</td>
                <td>{{ dashboard.resumen.usuarios.usuariosComunes }}</td>
              </tr>
              <tr>
                <td>Eventos activos</td>
                <td>{{ dashboard.resumen.actividades.activas }}</td>
              </tr>
              <tr>
                <td>Eventos cancelados</td>
                <td>{{ dashboard.resumen.actividades.canceladas }}</td>
              </tr>
              <tr>
                <td>Inscripciones totales</td>
                <td>{{ dashboard.resumen.inscripcionesTotales }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="card dashboard-panels__aside">
        <div class="section-head">
          <div>
            <h2>Atajos</h2>
            <p>Flujos principales para moverse por los modulos.</p>
          </div>
        </div>
        <div class="dashboard-shortcuts">
          <NuxtLink to="/events" class="dashboard-shortcuts__item">Explorar eventos</NuxtLink>
          <NuxtLink to="/notifications" class="dashboard-shortcuts__item">Revisar notificaciones</NuxtLink>
          <NuxtLink to="/favorites" class="dashboard-shortcuts__item">Ver favoritos</NuxtLink>
          <NuxtLink to="/registrations" class="dashboard-shortcuts__item">Ver inscripciones</NuxtLink>
          <NuxtLink v-if="isAdmin" to="/users" class="dashboard-shortcuts__item">Gestionar usuarios</NuxtLink>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { isAdmin } = useAuth()
const { dashboard, fetchDashboard } = useCommunityData()

await fetchDashboard()

const dashboardTitle = computed(() => {
  if (!dashboard.value) return 'Resumen'
  if (dashboard.value.rol === 'user') return 'Proximas actividades'
  if (dashboard.value.rol === 'organizer') return 'Actividades del organizador'
  return 'Metricas administrativas'
})

const dashboardSubtitle = computed(() => {
  if (!dashboard.value) return ''
  if (dashboard.value.rol === 'user') return 'Vista consolidada de eventos registrados.'
  if (dashboard.value.rol === 'organizer') return 'Seguimiento de eventos y participacion.'
  return 'Indicadores generales de la plataforma.'
})

const refreshAll = async () => {
  await fetchDashboard()
}
</script>

<style scoped lang="scss">
.dashboard-panels {
  margin-top: 1rem;

  &__main,
  &__aside {
    padding: 1.2rem;
  }
}

.dashboard-shortcuts {
  display: grid;
  gap: 0.8rem;

  &__item {
    padding: 0.95rem 1rem;
    border-radius: 18px;
    background: rgba(15, 118, 110, 0.08);
    font-weight: 700;
  }
}
</style>
