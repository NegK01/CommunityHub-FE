<template>
  <section class="auth-form">
    <div class="auth-form__tabs">
      <button
        type="button"
        class="auth-form__tab"
        :class="{ 'auth-form__tab--active': mode === 'login' }"
        @click="mode = 'login'"
      >
        Iniciar sesion
      </button>
      <button
        type="button"
        class="auth-form__tab"
        :class="{ 'auth-form__tab--active': mode === 'register' }"
        @click="mode = 'register'"
      >
        Registrarse
      </button>
    </div>

    <form class="auth-form__body" @submit.prevent="submit">
      <template v-if="mode === 'register'">
        <div class="grid auth-form__grid">
          <label>
            <span>Nombre</span>
            <input v-model="registerForm.nombre" class="input" required />
          </label>
          <label>
            <span>Apellido</span>
            <input v-model="registerForm.apellido" class="input" required />
          </label>
        </div>
      </template>

      <label>
        <span>Correo</span>
        <input v-model="email" type="email" class="input" required />
      </label>

      <label>
        <span>Contrasena</span>
        <input v-model="password" type="password" class="input" required minlength="6" />
      </label>

      <label v-if="mode === 'register'">
        <span>Foto de perfil (URL opcional)</span>
        <input v-model="registerForm.fotoPerfil" class="input" />
      </label>

      <button type="submit" class="button button-primary" :disabled="loading">
        {{ loading ? 'Procesando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta' }}
      </button>
    </form>

    <div class="auth-form__hint">
      <strong>Credenciales de prueba del backend</strong>
      <p>`admin@communityhub.com`, `organizer@communityhub.com` o `user@communityhub.com` con `password123`.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

const { login, register, loading } = useAuth()
const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const registerForm = reactive({
  nombre: '',
  apellido: '',
  fotoPerfil: ''
})

const submit = async () => {
  if (mode.value === 'login') {
    await login({
      email: email.value,
      password: password.value
    })
    return
  }

  await register({
    nombre: registerForm.nombre,
    apellido: registerForm.apellido,
    fotoPerfil: registerForm.fotoPerfil || null,
    email: email.value,
    password: password.value
  })
}
</script>

<style scoped lang="scss">
.auth-form {
  padding: 2rem;

  &__tabs {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  &__tab {
    border: 0;
    padding: 0.75rem 1rem;
    border-radius: 999px;
    background: #d9e2ec;
    color: #334155;
    font-weight: 700;

    &--active {
      background: rgba(15, 118, 110, 0.12);
      color: var(--primary);
    }
  }

  &__body {
    display: grid;
    gap: 1rem;
  }

  &__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  label span {
    display: block;
    margin-bottom: 0.4rem;
    font-weight: 700;
  }

  &__hint {
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 20px;
    background: rgba(148, 163, 184, 0.12);

    p {
      margin-bottom: 0;
      color: var(--muted);
    }
  }
}

@media (max-width: 720px) {
  .auth-form__grid {
    grid-template-columns: 1fr;
  }
}
</style>
