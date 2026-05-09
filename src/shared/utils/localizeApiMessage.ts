/** Sunucunun sabit İngilizce mesajlarını kullanıcı arayüzüne Türkçe yanıt olarak eşler. */

const KNOWN: ReadonlyArray<{ match: RegExp | string; tr: string }> = [
  {
    match:
      /^You have planned trainings with this trainer\.?$/i,
    tr:
      'Bu antrenörle planlanmış antrenmanların bulunuyor. Önce ilgili antrenmanları güncelle veya silerek listeni tekrar düzenlemeyi dene.',
  },
  {
    match: /^Trainer username list required\.?$/i,
    tr: 'En az bir atanmış antrenörünüz olmalıdır.',
  },
]

export function localizeApiMessage(raw: string): string {
  const s = raw.trim()
  if (!s) return raw
  for (const rule of KNOWN) {
    if (typeof rule.match === 'string') {
      if (s === rule.match) return rule.tr
    } else if (rule.match.test(s)) {
      return rule.tr
    }
  }
  return raw
}
