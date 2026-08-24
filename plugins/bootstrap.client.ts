export default defineNuxtPlugin(async () => {
  const { bootstrap } = useAuth()
  const { syncFromNavigator } = useNetwork()

  syncFromNavigator()
  await bootstrap()
})
