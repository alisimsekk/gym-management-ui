/** API bazen ISO string, bazen [y,m,d] dizisi donebilir. */
export function parseProfileDate(raw: unknown): string {
  if (raw == null) return ''
  if (typeof raw === 'string') return raw.slice(0, 10)
  if (Array.isArray(raw) && raw.length >= 3) {
    const [y, m, d] = raw as number[]
    const mm = String(m).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    return `${y}-${mm}-${dd}`
  }
  return ''
}
