<template>
  <AdminUsersManager />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { isAdmin } = useAuth()

if (!isAdmin.value) {
  await navigateTo('/dashboard')
}
</script>
