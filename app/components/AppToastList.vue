<template>
  <div class="toast-list">
    <article
      v-for="toast in toasts"
      :key="toast.id"
      class="toast-list__item card"
      :class="`toast-list__item--${toast.kind}`"
    >
      <div>
        <strong>{{ toast.title }}</strong>
        <p>{{ toast.message }}</p>
      </div>
      <button type="button" class="toast-list__close" @click="removeToast(toast.id)">
        Cerrar
      </button>
    </article>
  </div>
</template>

<script setup lang="ts">
const { toasts, removeToast } = useUi()
</script>

<style scoped lang="scss">
.toast-list {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 60;
  display: grid;
  gap: 0.75rem;
  width: min(360px, calc(100vw - 2rem));

  &__item {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem;

    p {
      margin: 0.35rem 0 0;
      color: var(--muted);
    }

    &--success {
      border-color: rgba(22, 163, 74, 0.2);
    }

    &--error {
      border-color: rgba(185, 28, 28, 0.18);
    }

    &--info {
      border-color: rgba(15, 118, 110, 0.18);
    }
  }

  &__close {
    border: 0;
    background: transparent;
    color: var(--muted);
  }
}
</style>
