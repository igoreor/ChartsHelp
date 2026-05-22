const store = new Map()
const TTL = Number(process.env.CACHE_TTL_MINUTES ?? 10) * 60 * 1000

export function getCache(key) {
  const entry = store.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    store.delete(key)
    return null
  }
  return entry.value
}

export function setCache(key, value) {
  store.set(key, { value, expiresAt: Date.now() + TTL })
}

export function clearCache() {
  store.clear()
}
