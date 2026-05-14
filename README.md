# Gym Management UI — Frontend

**Konya Gym Center** markası altında geliştirilmiş spor salonu yönetim web uygulamasının frontend arayüzüdür. Tanıtım sayfası, kimlik doğrulama, profil yönetimi, antrenman işlemleri ve admin paneli modüllerini içerir.

Backend API ile birlikte çalışır; tek başına işlevsel değildir.

---

## Kullanılan Teknolojiler

| Kategori | Teknoloji |
|----------|-----------|
| Framework | React 19 |
| Dil | TypeScript 6 |
| Derleme aracı | Vite 8 |
| Yönlendirme | React Router DOM 7 |
| Sunucu durumu | TanStack React Query 5 |
| Stil | Tailwind CSS 4 |
| HTTP istemcisi | Yerel `fetch` sarmalayıcısı |
| Kimlik doğrulama | JWT Bearer token (`localStorage`) |
| Lint | ESLint 10 + typescript-eslint |
| Prod dağıtım | Docker + nginx |

Harici UI component kütüphanesi kullanılmamıştır; tüm arayüz bileşenleri Tailwind CSS ile özel olarak tasarlanmıştır.

---

## Uygulama Özellikleri

### Tanıtım sayfası (Landing)

- Modern koyu temalı spor salonu vitrin sayfası
- Hakkımızda, grup dersleri ve kişisel antrenman paketleri bölümleri
- İletişim formu
- Kayıt ol ve giriş yap bağlantıları

### Öğrenci (TRAINEE)

- Self-kayıt veya admin tarafından oluşturulmuş hesapla giriş
- Profil bilgilerini görüntüleme ve güncelleme
- Atanmış antrenörleri yönetme (en az 1 antrenör zorunlu)
- Antrenör seçerek antrenman oluşturma
- Kendi antrenmanlarını listeleme, düzenleme ve silme
- Şifre değiştirme

### Antrenör (TRAINER)

- Profil ve uzmanlık alanı yönetimi
- Atanmış öğrencileri görüntüleme
- Öğrenci seçerek antrenman oluşturma
- Antrenman listesi CRUD işlemleri
- Aylık iş yükü özeti

### Yönetici (ADMIN)

- Öğrenci, antrenör ve admin hesabı oluşturma (oluşturulan kimlik bilgileri ekranda gösterilir)
- Antrenör ve öğrenci arama, detay görüntüleme, aktif/pasif toggle, silme
- Antrenman türü yönetimi (CRUD)
- Sistem geneli antrenman listesi ve düzenleme
- Antrenör iş yükü raporları

### Ortak özellikler

- Rol bazlı header kısayolları (Antrenman oluştur, Yönetim, Profil, Çıkış)
- API hatalarının Türkçe kullanıcı mesajlarına çevrilmesi
- Silme işlemlerinde onay diyalogları
- Admin listelerinde debounced arama alanları
- JWT süresi dolduğunda oturumun otomatik geçersiz sayılması

---

## Sayfalar ve Rotalar

### Herkese açık

| Rota | Sayfa | Açıklama |
|------|-------|----------|
| `/` | Landing | Tanıtım ve vitrin sayfası |
| `/auth/login` | Giriş | Kullanıcı adı/şifre ile oturum açma |
| `/auth/register` | Kayıt | Öğrenci self-kayıt |

### Korumalı (giriş zorunlu)

| Rota | Sayfa | Açıklama |
|------|-------|----------|
| `/auth/change-password` | Şifre değiştir | Oturum açmış kullanıcı şifre güncelleme |
| `/antrenman/yeni` | Antrenman oluştur | Rol bazlı antrenman ekleme formu |
| `/profil` | Profil özeti | Profil bilgileri ve düzenleme |
| `/profil/antrenorler` | Antrenörlerim | Öğrenci: atanmış antrenör yönetimi |
| `/profil/antrenmanlar` | Antrenmanlarım | Kendi antrenman listesi |
| `/profil/ogrencilerim` | Öğrencilerim | Antrenör: atanmış öğrenciler |
| `/profil/is-yuku` | İş yükü | Antrenör: aylık iş yükü özeti |

### Admin (yalnızca ADMIN rolü)

| Rota | Sayfa | Açıklama |
|------|-------|----------|
| `/admin` | Yönetim paneli | Özet ve hızlı erişim linkleri |
| `/admin/kullanicilar/yeni-ogrenci` | Üye oluştur | Admin tarafından öğrenci ekleme |
| `/admin/kullanicilar/yeni-antrenor` | Antrenör oluştur | Antrenör ekleme |
| `/admin/kullanicilar/yeni-admin` | Admin oluştur | Yeni admin hesabı |
| `/admin/antrenorler` | Antrenör listesi | Arama ve listeleme |
| `/admin/antrenorler/:username` | Antrenör detay | Düzenleme, durum, silme |
| `/admin/ogrenciler` | Öğrenci listesi | Arama ve listeleme |
| `/admin/ogrenciler/:username` | Öğrenci detay | Profil, antrenör atama, silme |
| `/admin/antrenman-turleri` | Antrenman türleri | CRUD yönetimi |
| `/admin/antrenmanlar` | Tüm antrenmanlar | Sistem geneli liste |
| `/admin/antrenmanlar/yeni` | Antrenman oluştur | Admin: herhangi bir çift için antrenman |
| `/admin/raporlar/antrenor/:username` | İş yükü raporu | Antrenör aylık özet |

---

## Proje Yapısı

```
gym-management-ui/
├── public/                     # Statik dosyalar (favicon, görseller)
├── src/
│   ├── app/                    # Router, route guard, providers
│   ├── features/
│   │   ├── auth/             # Giriş, kayıt, şifre değiştirme
│   │   ├── profile/          # Profil, antrenör/öğrenci ilişkileri
│   │   ├── workouts/         # Antrenman CRUD
│   │   └── admin/            # Yönetim paneli
│   ├── shared/
│   │   ├── api/              # HTTP istemcisi, API yapılandırması
│   │   ├── layout/           # AppShell, Header
│   │   ├── ui/               # Ortak UI bileşenleri
│   │   ├── hooks/            # Özel React hook'ları
│   │   └── utils/            # Yardımcı fonksiyonlar
│   ├── App.tsx               # Landing page
│   └── main.tsx
├── .env.example
├── vite.config.ts
├── Dockerfile
└── nginx.conf
```

**Mimari:** Feature-based klasörleme; her modül altında `pages`, `components`, `hooks`, `services` ve `types` alt klasörleri bulunur.

---

## API Entegrasyonu

Backend REST API ile iletişim kurulur.

| Ayar | Değer |
|------|-------|
| Base URL | `http://localhost:8089/api/v1` |
| Kimlik doğrulama | `Authorization: Bearer {accessToken}` |
| İçerik tipi | `application/json` |

**Kullanılan endpoint grupları:**

- `/auth` — Kayıt, giriş, şifre değiştirme
- `/trainees` — Üye profil ve arama
- `/trainers` — Antrenör profil ve arama
- `/trainings` — Antrenman CRUD ve arama
- `/training-types` — Antrenman türü yönetimi
- `/report` — Antrenör iş yükü özeti
- `/admin/users` — Admin kullanıcı oluşturma ve profil

Sunucu durumu TanStack React Query ile yönetilir; sorgular ve mutation'lar feature servisleri üzerinden çağrılır.

---

## Kurulum ve Çalıştırma

### Gereksinimler

- Node.js 22+
- Backend API'nin `8089` portunda çalışıyor olması

### Yerel geliştirme

```bash
cd gym-management-ui
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde açılır.

### Ortam değişkenleri

`.env.development` dosyasında:

```env
VITE_API_BASE_URL=http://localhost:8089/api/v1
```

Tanımlı değilse `http://localhost:8089/api/v1` varsayılan olarak kullanılır.

### Build ve önizleme

```bash
npm run build
npm run preview
```

### Docker (prod)

```bash
docker build --build-arg VITE_API_BASE_URL=/api/v1 -t gym-management-ui .
```

nginx üzerinden statik dosya sunulur; SPA routing için `try_files` fallback yapılandırması mevcuttur.

### npm scriptleri

| Script | Açıklama |
|--------|----------|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | TypeScript derleme + prod build |
| `npm run preview` | Build önizleme |
| `npm run lint` | ESLint kontrolü |

---

## İlgili Proje

Backend API [`gym-management`](../gym-management/) klasöründedir. Tam işlevsellik için önce backend ve bağımlı servislerin (PostgreSQL, MongoDB, ActiveMQ) çalıştırılması gerekir.
