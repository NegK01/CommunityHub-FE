<template>
  <section class="module-page">
    <header class="section-head">
      <div>
        <h1>Categorias</h1>
        <p>Catalogo funcional para clasificar los eventos. La gestion completa es administrativa.</p>
      </div>
      <button v-if="isAdmin" type="button" class="button button-primary" @click="resetForm">
        Nueva categoria
      </button>
    </header>

    <section v-if="isAdmin" class="card category-editor">
      <div class="section-head">
        <div>
          <h2>{{ editingId ? 'Editar categoria' : 'Crear categoria' }}</h2>
          <p>Las categorias se envian al backend con nombre, descripcion y color.</p>
        </div>
      </div>

      <form class="grid category-editor__grid" @submit.prevent="submitCategory">
        <label>
          <span>Nombre</span>
          <input v-model="form.nombre" class="input" required />
        </label>
        <label>
          <span>Color</span>
          <input v-model="form.color" type="color" class="input" />
        </label>
        <label class="category-editor__full">
          <span>Descripcion</span>
          <textarea v-model="form.descripcion" class="textarea" rows="3" />
        </label>
        <button type="submit" class="button button-primary">
          {{ editingId ? 'Guardar cambios' : 'Crear categoria' }}
        </button>
      </form>
    </section>

    <div class="grid category-grid">
      <article v-for="category in categories" :key="category._id" class="card category-card">
        <div class="category-card__head">
          <span class="category-card__dot" :style="{ backgroundColor: category.color || '#0f766e' }" />
          <div>
            <h3>{{ category.nombre }}</h3>
            <small>{{ category.activa ? 'Activa' : 'Desactivada' }}</small>
          </div>
        </div>
        <p>{{ category.descripcion || 'Sin descripcion registrada.' }}</p>
        <div v-if="isAdmin" class="category-card__actions">
          <button type="button" class="button button-secondary" @click="editCategory(category)">Editar</button>
          <button type="button" class="button button-danger" @click="disableCurrentCategory(category._id)">
            Desactivar
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Category } from '~/types/api'

definePageMeta({
  middleware: 'auth'
})

const { isAdmin } = useAuth()
const { categories, fetchCategories, createCategory, updateCategory, disableCategory } = useCommunityData()

const editingId = ref<string | null>(null)
const createEmpty = () => ({
  nombre: '',
  descripcion: '',
  color: '#0f766e'
})
const form = reactive(createEmpty())

await fetchCategories(isAdmin.value)

const resetForm = () => {
  editingId.value = null
  Object.assign(form, createEmpty())
}

const editCategory = (category: Category) => {
  editingId.value = category._id
  Object.assign(form, {
    nombre: category.nombre,
    descripcion: category.descripcion || '',
    color: category.color || '#0f766e'
  })
}

const submitCategory = async () => {
  if (editingId.value) {
    await updateCategory(editingId.value, form)
  } else {
    await createCategory(form)
  }

  resetForm()
}

const disableCurrentCategory = async (categoryId: string) => {
  await disableCategory(categoryId)
}
</script>

<style scoped lang="scss">
.category-editor {
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

.category-grid {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.category-card {
  padding: 1.2rem;
  display: grid;
  gap: 1rem;

  h3,
  p {
    margin: 0;
  }

  p,
  small {
    color: var(--muted);
  }

  &__head,
  &__actions {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  &__dot {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
  }
}

@media (max-width: 720px) {
  .category-editor__grid {
    grid-template-columns: 1fr;
  }
}
</style>
