import { defineEventHandler, getRequestURL, getRouterParam, proxyRequest } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const path = getRouterParam(event, 'path') || ''
  const query = getRequestURL(event).search || ''
  const target = `${config.apiTarget.replace(/\/$/, '')}/${path}${query}`

  return proxyRequest(event, target)
})
