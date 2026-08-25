<template>
  <section class="module-page">
    <header class="section-head">
      <div>
        <h1>Usuarios</h1>
        <p>Gestiona cuentas, roles y datos de perfil desde el panel administrativo.</p>
      </div>
      <span class="admin-users__count">{{ users.length }} usuario(s)</span>
    </header>

    <section class="card module-page__filters admin-users__filters">
      <div class="grid module-page__filters-grid">
        <label>
          <span>Buscar</span>
          <input
            v-model="filters.search"
            class="input"
            placeholder="Nombre, apellido o correo"
            type="search"
          />
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
      <p class="admin-users__hint">La busqueda se aplica automaticamente mientras escribes.</p>
    </section>

    <section class="card user-table">
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Perfil</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody v-if="users.length">
            <tr v-for="account in users" :key="account._id">
              <td>
                <div class="admin-users__profile">
                  <img
                    :src="drafts[account._id]?.fotoPerfil || fallbackAvatar"
                    :alt="`Avatar de ${account.nombre}`"
                    class="admin-users__avatar"
                  />
                  <div class="admin-users__fields">
                    <input v-model="drafts[account._id].nombre" class="input" placeholder="Nombre" />
                    <input v-model="drafts[account._id].apellido" class="input" placeholder="Apellido" />
                    <input
                      v-model="drafts[account._id].fotoPerfil"
                      class="input"
                      placeholder="https://ejemplo.com/foto.jpg"
                    />
                  </div>
                </div>
              </td>
              <td>
                <div class="admin-users__email">
                  <strong>{{ account.email }}</strong>
                  <small v-if="currentUser?._id === account._id">Tu cuenta actual</small>
                </div>
              </td>
              <td>
                <select
                  class="select"
                  :disabled="roleSavingId === account._id"
                  :value="account.rol"
                  @change="changeRole(account, ($event.target as HTMLSelectElement).value)"
                >
                  <option value="admin">admin</option>
                  <option value="organizer">organizer</option>
                  <option value="user">user</option>
                </select>
              </td>
              <td>
                <div class="admin-users__actions">
                  <button
                    type="button"
                    class="button button-secondary"
                    :disabled="profileSavingId === account._id"
                    @click="saveProfile(account)"
                  >
                    {{ profileSavingId === account._id ? 'Guardando...' : 'Guardar perfil' }}
                  </button>
                  <button
                    type="button"
                    class="button button-danger"
                    :disabled="deletingId === account._id"
                    @click="removeUser(account)"
                  >
                    {{ deletingId === account._id ? 'Eliminando...' : 'Eliminar' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="4" class="admin-users__empty">
                {{ loading ? 'Cargando usuarios...' : 'No se encontraron usuarios con esos filtros.' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import type { User } from '~/types/api'

interface EditableUserDraft {
  nombre: string
  apellido: string
  fotoPerfil: string
}

const fallbackAvatar =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' rx='48' fill='%230f766e'/%3E%3Ccircle cx='48' cy='36' r='18' fill='white'/%3E%3Cpath d='M18 82c4-16 20-24 30-24s26 8 30 24' fill='white'/%3E%3C/svg%3E"

const { user: currentUser } = useAuth()
const { pushToast } = useUi()
const { users, fetchUsers, updateUser, deleteUser } = useCommunityData()

const filters = reactive({
  search: '',
  rol: ''
})

const drafts = reactive<Record<string, EditableUserDraft>>({})
const loading = ref(false)
const roleSavingId = ref<string | null>(null)
const profileSavingId = ref<string | null>(null)
const deletingId = ref<string | null>(null)

const activeFilters = computed(() => ({
  search: filters.search.trim(),
  rol: filters.rol
}))

const syncDrafts = (items: User[]) => {
  const nextIds = new Set(items.map((item) => item._id))

  Object.keys(drafts).forEach((id) => {
    if (!nextIds.has(id)) {
      delete drafts[id]
    }
  })

  items.forEach((item) => {
    drafts[item._id] = {
      nombre: item.nombre,
      apellido: item.apellido,
      fotoPerfil: item.fotoPerfil || ''
    }
  })
}

watch(users, (items) => {
  syncDrafts(items)
}, { immediate: true })

const loadUsers = async () => {
  loading.value = true

  try {
    await fetchUsers(activeFilters.value)
  } finally {
    loading.value = false
  }
}

await loadUsers()

let searchTimer: ReturnType<typeof setTimeout> | null = null

watch(() => filters.search, () => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }

  searchTimer = setTimeout(() => {
    void loadUsers()
  }, 300)
})

watch(() => filters.rol, () => {
  void loadUsers()
})

onBeforeUnmount(() => {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
})

const changeRole = async (account: User, rol: string) => {
  if (account.rol === rol) {
    return
  }

  roleSavingId.value = account._id

  try {
    const updated = await updateUser(account._id, { rol }, activeFilters.value)

    pushToast('success', 'Rol actualizado', `El rol de ${updated.nombre} fue actualizado.`)
  } finally {
    roleSavingId.value = null
  }
}

const saveProfile = async (account: User) => {
  const draft = drafts[account._id]
  const nombre = draft.nombre.trim()
  const apellido = draft.apellido.trim()
  const fotoPerfil = draft.fotoPerfil.trim()

  if (!nombre || !apellido) {
    pushToast('error', 'Datos incompletos', 'El nombre y el apellido son obligatorios.')
    return
  }

  profileSavingId.value = account._id

  try {
    const updated = await updateUser(
      account._id,
      {
        nombre,
        apellido,
        fotoPerfil: fotoPerfil || null
      },
      activeFilters.value
    )

    pushToast('success', 'Perfil actualizado', `Se actualizaron los datos de ${updated.nombre}.`)
  } finally {
    profileSavingId.value = null
  }
}

const removeUser = async (account: User) => {
  const confirmed = import.meta.client
    ? window.confirm(`Se eliminara la cuenta de ${account.nombre} ${account.apellido}. Deseas continuar?`)
    : true

  if (!confirmed) {
    return
  }

  deletingId.value = account._id

  try {
    await deleteUser(account._id, activeFilters.value)
    pushToast('success', 'Usuario eliminado', `La cuenta de ${account.nombre} fue eliminada.`)
  } finally {
    deletingId.value = null
  }
}
</script>

<style scoped lang="scss">
.admin-users {
  &__count {
    padding: 0.5rem 0.85rem;
    border-radius: 999px;
    background: rgba(15, 118, 110, 0.12);
    color: #0f766e;
    font-weight: 700;
  }

  &__filters,
  &__profile,
  &__fields,
  &__email,
  &__actions {
    display: grid;
    gap: 0.75rem;
  }

  &__filters {
    padding: 1rem 1.2rem;
  }

  &__hint,
  &__email small,
  &__empty {
    color: var(--muted);
  }

  &__profile {
    grid-template-columns: auto 1fr;
    align-items: start;
  }

  &__fields {
    min-width: 220px;
  }

  &__email strong {
    display: block;
  }

  &__actions {
    min-width: 170px;
  }

  &__avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    object-fit: cover;
    background: rgba(15, 118, 110, 0.12);
  }

  &__empty {
    padding: 1.5rem;
    text-align: center;
  }
}

.user-table {
  padding: 1rem;
}

@media (max-width: 860px) {
  .admin-users__profile {
    grid-template-columns: 1fr;
  }
}
</style>
