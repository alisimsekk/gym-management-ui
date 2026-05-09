const DEFAULT_DEV_BASE_URL = 'http://localhost:8089/api/v1'
const DEFAULT_PROD_BASE_URL = 'http://localhost:8089/api/v1'

export const getApiBaseUrl = (): string => {
  const configured = import.meta.env.VITE_API_BASE_URL
  if (configured && configured.trim().length > 0) {
    return configured
  }

  if (import.meta.env.DEV) {
    console.warn(
      '[api] VITE_API_BASE_URL tanimli degil. Varsayilan deger kullaniliyor:',
      DEFAULT_DEV_BASE_URL,
    )
    return DEFAULT_DEV_BASE_URL
  }

  return DEFAULT_PROD_BASE_URL
}
