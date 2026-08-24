<template>
  <section class="module-page">
    <header class="section-head">
      <div>
        <h1>Perfil</h1>
        <p>Actualización de la cuenta autenticada con persistencia local de la sesión.</p>
      </div>
    </header>

    <section class="card profile-card">
      <form class="grid profile-card__grid" @submit.prevent="submitProfile">
        <div class="profile-card__preview card">
          <img
            v-if="showImagePreview"
            :src="form.fotoPerfil"
            alt="Vista previa de foto de perfil"
            @load="imageState = 'loaded'"
            @error="imageState = 'error'"
          />
          <div v-else class="profile-card__fallback">
            {{ userInitials }}
          </div>
          <strong>Vista previa</strong>
          <small v-if="imageState === 'error'">
            No se pudo cargar la imagen desde esa URL. Revise el enlace, pero esto no significa que la app esté offline.
          </small>
          <small v-else-if="showImagePreview">
            La imagen se está leyendo directamente desde la URL ingresada.
          </small>
          <small v-else>
            Ingrese una URL para ver la foto antes de guardar.
          </small>
        </div>
        <label>
          <span>Nombre</span>
          <input v-model="form.nombre" class="input" required />
        </label>
        <label>
          <span>Apellido</span>
          <input v-model="form.apellido" class="input" required />
        </label>
        <label class="profile-card__full">
          <span>Foto de perfil</span>
          <input v-model="form.fotoPerfil" class="input" />
        </label>
        <div class="profile-card__meta">
          <strong>{{ user?.email }}</strong>
          <small>Rol actual: {{ user?.rol }}</small>
        </div>
        <button type="submit" class="button button-primary">Guardar cambios</button>
      </form>
    </section>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { user, patchUser } = useAuth()
const { updateUser } = useCommunityData()

const form = reactive({
  nombre: user.value?.nombre || '',
  apellido: user.value?.apellido || '',
  fotoPerfil: user.value?.fotoPerfil || ''
})

const imageState = ref<'idle' | 'loaded' | 'error'>('idle')

const showImagePreview = computed(() => {
  return Boolean(form.fotoPerfil && imageState.value !== 'error')
})

const userInitials = computed(() => {
  const name = `${form.nombre} ${form.apellido}`.trim() || `${user.value?.nombre || ''} ${user.value?.apellido || ''}`.trim()
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'CH'
})

watch(
  () => form.fotoPerfil,
  (value) => {
    imageState.value = value ? 'loaded' : 'idle'
  },
  { immediate: true }
)

const submitProfile = async () => {
  if (!user.value) return
  const updated = await updateUser(user.value._id, {
    nombre: form.nombre,
    apellido: form.apellido,
    fotoPerfil: form.fotoPerfil || null
  })
  patchUser(updated)
}
</script>

<style scoped lang="scss">
.profile-card {
  padding: 1.2rem;

  &__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &__preview {
    grid-column: 1 / -1;
    display: grid;
    justify-items: center;
    gap: 0.8rem;
    padding: 1.4rem;
    text-align: center;

    img,
    .profile-card__fallback {
      width: 7rem;
      height: 7rem;
      border-radius: 50%;
      object-fit: cover;
      border: 1px solid rgba(45, 212, 191, 0.35);
      background: linear-gradient(135deg, rgba(15, 118, 110, 0.25), rgba(30, 41, 59, 0.9));
    }

    small {
      color: var(--muted);
      max-width: 44ch;
    }
  }

  &__fallback {
    display: grid;
    place-items: center;
    font-family: var(--font-display);
    font-size: 1.75rem;
    font-weight: 800;
    color: #d5fffb;
  }

  &__full,
  &__meta {
    grid-column: 1 / -1;
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    gap: 1rem;

    small {
      color: var(--muted);
    }
  }

  label span {
    display: block;
    margin-bottom: 0.4rem;
    font-weight: 700;
  }
}

@media (max-width: 720px) {
  .profile-card__grid {
    grid-template-columns: 1fr;
  }
}
</style>
