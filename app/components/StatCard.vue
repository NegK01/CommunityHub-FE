<template>
  <article class="stat-card card">
    <p>{{ title }}</p>
    <strong>{{ value }}</strong>
    <small>{{ caption }}</small>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  caption: string
}>()
</script>

<style scoped lang="scss">
.stat-card {
  padding: 1.2rem;

  p,
  small {
    margin: 0;
    color: var(--muted);
  }

  strong {
    display: block;
    margin: 0.5rem 0;
    font-size: clamp(1.8rem, 2vw, 2.4rem);
    font-family: var(--font-display);
  }
}
</style>
