/** Dizin / arama yanıtlarında yalnızca etkin hesapları seçim kutularında göstermek için. */
export function filterActiveUsers<T extends { isActive: boolean }>(
  list: T[] | undefined,
): T[] {
  return (list ?? []).filter((u) => u.isActive)
}
