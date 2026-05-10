export interface AdminNavItem {
  to: string
  label: string
  description: string
}

export const adminPrimaryNav: ReadonlyArray<AdminNavItem> = [
  {
    to: '/admin',
    label: 'Özet',
    description: 'Modüllere hızlı erişim.',
  },
  {
    to: '/admin/antrenorler',
    label: 'Antrenörler',
    description: 'Arama, düzenleme ve rapor.',
  },
  {
    to: '/admin/ogrenciler',
    label: 'Öğrenciler',
    description: 'Arama ve atanmış antrenörler.',
  },
  {
    to: '/admin/antrenman-turleri',
    label: 'Antrenman türleri',
    description: 'Uzm. alanı ve tür yönetimi.',
  },
  {
    to: '/admin/antrenmanlar',
    label: 'Tüm antrenmanlar',
    description: 'Sistem geneli liste ve düzenleme.',
  },
  {
    to: '/admin/antrenmanlar/yeni',
    label: 'Yeni antrenman',
    description: 'Herhangi bir çift için oluştur.',
  },
]

export const adminUserCreateNav: ReadonlyArray<AdminNavItem> = [
  {
    to: '/admin/kullanicilar/yeni-ogrenci',
    label: 'Yeni öğrenci',
    description: 'Sisteme yeni üye kaydı.',
  },
  {
    to: '/admin/kullanicilar/yeni-antrenor',
    label: 'Yeni antrenör',
    description: 'Uzmanlık alanı ile birlikte.',
  },
  {
    to: '/admin/kullanicilar/yeni-admin',
    label: 'Yeni yönetici',
    description: 'Ek yönetici hesabı oluştur.',
  },
]
