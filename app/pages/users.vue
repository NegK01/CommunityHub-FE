<template>
  <section class="module-page">
    <header class="section-head">
      <div>
        <h1>Usuarios</h1>
        <p>Panel administrativo para busqueda, cambio de roles y eliminacion de cuentas.</p>
      </div>
    </header>

    <section class="card module-page__filters">
      <div class="grid module-page__filters-grid">
        <label>
          <span>Buscar</span>
          <input v-model="filters.search" class="input" placeholder="Nombre, apellido o correo" />
        </label>
        <label>
          <span>Rol</span>
          <select v-model="filters.rol" class="select">
            <option value="">Todos</option>
            <option value="admin">Admin</option>
            <option value="organizer">Organizer</option>
            <option value="user">User</option>
          </select>
        </label>
      </div>
      <button type="button" class="button button-secondary" @click="applyFilters">Filtrar</button>
    </section>

    <section class="card user-table">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="account in users" :key="account._id">
              <td>{{ account.nombre }} {{ account.apellido }}</td>
              <td>
                <select
                  class="select"
                  :value="account.rol"
                  @change="changeRole(account._id, ($event.target as HTMLSelectElement).value)"
                >
                  <option value="admin">admin</option>
                  <option value="organizer">organizer</option>
                  <option value="user">user</option>
                </select>
              </td>
              <td>{{ account.email }}</td>
              <td>
                <button type="button" class="button button-danger" @click="removeUser(account._id)">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { isAdmin } = useAuth()
if (!isAdmin.value) {
  await navigateTo('/dashboard')
}

const { users, fetchUsers, updateUser, deleteUser } = useCommunityData()

const filters = reactive({
  search: '',
  rol: ''
})

await fetchUsers()

const applyFilters = async () => {
  await fetchUsers(filters)
}

const changeRole = async (userId: string, rol: string) => {
  await updateUser(userId, { rol })
}

const removeUser = async (userId: string) => {
  await deleteUser(userId)
}
</script>

<style scoped lang="scss">
.user-table {
  padding: 1rem;
}
</style>
