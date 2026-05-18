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
    {
        match: /^Training can only be scheduled at allowed full-hour slots\.?$/i,
        tr: 'Antrenman yalnızca izin verilen tam saat dilimlerinde planlanabilir (09:00, 10:00, …).',
    },
    {
        match: /^Training duration cannot exceed 45 minutes\.?$/i,
        tr: 'Antrenman süresi en fazla 45 dakika olabilir.',
    },
    {
        match: /^Cannot schedule training in the past\.?$/i,
        tr: 'Geçmiş bir tarih veya saat için antrenman oluşturulamaz.',
    },
    {
        match: /^Trainer already has a training at this time\.?$/i,
        tr: 'Antrenörün bu saatte başka bir antrenmanı var.',
    },
    {
        match: /^Trainee already has a training at this time\.?$/i,
        tr: 'Öğrencinin bu saatte başka bir antrenmanı var.',
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
