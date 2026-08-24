export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuth()
  await auth.bootstrap()

  if (auth.isLoggedIn.value) {
    return navigateTo('/dashboard')
  }
})
