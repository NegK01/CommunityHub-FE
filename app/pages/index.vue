<script setup lang="ts">
const auth = useAuth()
await auth.bootstrap()

if (auth.isLoggedIn.value) {
  await navigateTo('/dashboard')
} else {
  await navigateTo('/login')
}
</script>

<template>
  <div />
</template>
