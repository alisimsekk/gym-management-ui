import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { WelcomePasswordModal } from './features/auth/components/WelcomePasswordModal'
import type { RegisterWelcomeState } from './features/auth/types/navigation.types'
import { useAuth } from './features/auth/hooks/useAuth'
import { APP_BRAND_BADGE, APP_BRAND_NAME } from './shared/constants/brand'

type ClassLevel = 'Başlangıç' | 'Orta' | 'İleri'

interface GroupClass {
  name: string
  duration: string
  level: ClassLevel
  description: string
  image: string
}

interface PersonalPackage {
  name: string
  sessions: string
  highlight: string
  description: string
}

const groupClasses: GroupClass[] = [
  {
    name: 'Fonksiyonel Antrenman',
    duration: '45 dk',
    level: 'Orta',
    description:
      'Tüm vücut kuvveti, denge ve dayanıklılık odaklı dinamik grup antrenmanı.',
    image: '/images/sven-mieke-MsCgmHuirDo-unsplash.jpg',
  },
  {
    name: 'HIIT',
    duration: '30 dk',
    level: 'İleri',
    description:
      'Yüksek tempo aralıklı çalışma ile kısa sürede etkili yağ yakımı ve kondisyon.',
    image: '/images/samuel-girven-2e4lbLTqPIo-unsplash.jpg',
  },
  {
    name: 'Pilates',
    duration: '50 dk',
    level: 'Başlangıç',
    description:
      'Postür, merkez bölge gücü ve esneklik geliştiren kontrollü egzersiz serisi.',
    image: '/images/temple-noble-art-TeL4E6S5BQU-unsplash.jpg',
  },
  {
    name: 'Spinning',
    duration: '40 dk',
    level: 'Orta',
    description:
      'Ritimli müzik eşliğinde kardiyo kapasitesini artıran bisiklet dersi.',
    image: '/images/danielle-cerullo-CQfNt66ttZM-unsplash.jpg',
  },
]

const personalPackages: PersonalPackage[] = [
  {
    name: 'Başlangıç Paketi',
    sessions: 'Aylık 8 seans',
    highlight: 'Hedef analizi + ölçüm',
    description:
      'Spora yeni başlayanlar için temel teknikler ve düzenli takip odaklı program.',
  },
  {
    name: 'Performans Paketi',
    sessions: 'Aylık 12 seans',
    highlight: 'Haftalık gelişim raporu',
    description:
      'Güç, dayanıklılık ve performans artışı hedefleyen uyarlanabilir antrenman planı.',
  },
  {
    name: 'Premium Dönüşüm',
    sessions: 'Aylık 16 seans',
    highlight: 'Kapsamlı birebir takip',
    description:
      'Yoğun hedefi olan üyeler için antrenör eşliğinde detaylı dönüşüm programı.',
  },
]

const levelStyles: Record<ClassLevel, string> = {
  Başlangıç: 'bg-emerald-500/20 text-emerald-200 border-emerald-300/30',
  Orta: 'bg-cyan-500/20 text-cyan-100 border-cyan-300/30',
  İleri: 'bg-violet-500/20 text-violet-100 border-violet-300/30',
}

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, role } = useAuth()
  const [submitted, setSubmitted] = useState(false)
  const showCreateTraining =
    isAuthenticated && (role === 'TRAINEE' || role === 'TRAINER')

  const welcome = (location.state as RegisterWelcomeState | null)?.registerWelcome
  const showWelcomeModal = Boolean(
    welcome?.username && welcome.plainPassword && welcome.plainPassword.length > 0,
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="relative overflow-hidden">
      {showWelcomeModal && welcome && (
        <WelcomePasswordModal
          username={welcome.username}
          plainPassword={welcome.plainPassword}
          onDismiss={() =>
            navigate(location.pathname, { replace: true, state: {} })
          }
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.20),_transparent_50%)]" />

      <main>
        <section
          id="anasayfa"
          className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24"
        >
          <div className="flex flex-col justify-center">
            <p className="mb-3 w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium tracking-wide text-cyan-300">
              {APP_BRAND_BADGE}
            </p>
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              {APP_BRAND_NAME} ile hedeflerine güvenle ulaş
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
              Uzman antrenörler, modern ekipman ve sana özel programlarla daha
              güçlü bir sen. Hedefini belirle, sürecini takip et, sonuçlarını
              bizimle büyüt.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {!isAuthenticated && (
                <Link
                  to="/auth/register"
                  className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Kayıt Ol
                </Link>
              )}
              <a
                href="#grup-dersleri"
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
              >
                Ders Programını İncele
              </a>
              {showCreateTraining && (
                <Link
                  to="/antrenman/yeni"
                  className="rounded-full border border-cyan-400/50 bg-cyan-500/10 px-5 py-2.5 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-500/20"
                >
                  Antrenman oluştur
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="/images/sven-mieke-MsCgmHuirDo-unsplash.jpg"
              alt="Antrenman alanı"
              className="h-44 w-full rounded-2xl object-cover shadow-lg shadow-cyan-900/20 md:h-56"
            />
            <img
              src="/images/danielle-cerullo-CQfNt66ttZM-unsplash.jpg"
              alt="Birlikte antrenman yapan sporcular"
              className="h-44 w-full rounded-2xl object-cover shadow-lg shadow-cyan-900/20 md:h-56"
            />
            <img
              src="/images/samuel-girven-2e4lbLTqPIo-unsplash.jpg"
              alt="Ağırlık çalışan sporcu"
              className="h-44 w-full rounded-2xl object-cover shadow-lg shadow-cyan-900/20 md:h-56"
            />
            <img
              src="/images/temple-noble-art-TeL4E6S5BQU-unsplash.jpg"
              alt="Spor salonu ekipman alanı"
              className="h-44 w-full rounded-2xl object-cover shadow-lg shadow-cyan-900/20 md:h-56"
            />
          </div>
        </section>

        <section id="hakkimizda" className="mx-auto max-w-7xl px-6 pb-14">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Hakkımızda
          </h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
              <h3 className="text-xl font-semibold text-white">
                Güvenli, temiz ve motive edici ortam
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {APP_BRAND_NAME} olarak her seviyeden üye için konforlu bir spor
                deneyimi sunuyoruz. Uzman ekibimizle hedeflerini analiz ediyor,
                sana uygun antrenman planını oluşturuyoruz.
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-slate-200">
                <li>Uzman antrenör kadrosu</li>
                <li>Modern ekipman altyapısı</li>
                <li>Kişiye özel süreç takibi</li>
                <li>Hijyen ve konfor odaklı tesis</li>
              </ul>
            </article>
            <img
              src="/images/sven-mieke-MsCgmHuirDo-unsplash.jpg"
              alt="Profesyonel spor salonu alanı"
              className="h-full min-h-72 w-full rounded-2xl object-cover"
            />
          </div>
        </section>

        <section id="grup-dersleri" className="mx-auto max-w-7xl px-6 pb-14">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Grup Dersleri
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Enerjini yükselten, motivasyonu artıran ve ekip ruhu kazandıran
            derslerle performansını birlikte artır.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {groupClasses.map((groupClass) => (
              <article
                key={groupClass.name}
                className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80"
              >
                <img
                  src={groupClass.image}
                  alt={groupClass.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-white">
                      {groupClass.name}
                    </h3>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs ${levelStyles[groupClass.level]}`}
                    >
                      {groupClass.level}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-cyan-300">
                    Süre: {groupClass.duration}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {groupClass.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="kisisel-antrenman" className="mx-auto max-w-7xl px-6 pb-14">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Kişisel Antrenman
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Kendi hedeflerine uygun birebir çalışma modeliyle daha hızlı ve
            kontrollü ilerle.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {personalPackages.map((pkg) => (
              <article
                key={pkg.name}
                className="rounded-2xl border border-white/10 bg-slate-900/80 p-5"
              >
                <h3 className="text-lg font-semibold text-white">{pkg.name}</h3>
                <p className="mt-1 text-xs font-medium text-cyan-300">
                  {pkg.sessions}
                </p>
                <p className="mt-3 text-sm font-medium text-slate-100">
                  {pkg.highlight}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {pkg.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="iletisim" className="mx-auto max-w-7xl px-6 pb-16">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            İletişim
          </h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/10 bg-slate-900/80 p-6"
            >
              <div className="grid gap-4">
                <label className="grid gap-1 text-sm text-slate-200">
                  Ad Soyad
                  <input
                    required
                    className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300"
                  />
                </label>
                <label className="grid gap-1 text-sm text-slate-200">
                  Telefon
                  <input
                    required
                    className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300"
                  />
                </label>
                <label className="grid gap-1 text-sm text-slate-200">
                  E-posta
                  <input
                    type="email"
                    required
                    className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300"
                  />
                </label>
                <label className="grid gap-1 text-sm text-slate-200">
                  Mesaj
                  <textarea
                    required
                    rows={4}
                    className="rounded-lg border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Mesajı Gönder
                </button>
              </div>

              {submitted && (
                <p className="mt-4 rounded-lg border border-emerald-300/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
                  Mesajınız alındı, en kısa sürede size dönüş yapacağız.
                </p>
              )}
            </form>

            <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/80 p-6 text-sm text-slate-200">
              <p>
                <span className="font-semibold text-white">Adres:</span>{' '}
                Konya Teknik Üniversitesi Kampüsü, Spor Merkezi No: 12, Konya
              </p>
              <p>
                <span className="font-semibold text-white">Telefon:</span>{' '}
                +90 (332) 000 00 00
              </p>
              <p>
                <span className="font-semibold text-white">E-posta:</span>{' '}
                info@ktungym.com
              </p>
              <p>
                <span className="font-semibold text-white">
                  Çalışma Saatleri:
                </span>{' '}
                Hafta içi 07:00 - 22:30 | Hafta sonu 09:00 - 20:00
              </p>
              <div className="rounded-xl border border-dashed border-white/20 bg-slate-950 p-6 text-center text-slate-400">
                Harita alanı (Google Maps gömülebilecek sonraki adımda)
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-2 border-t border-white/10 px-6 py-6 text-sm text-slate-400 md:flex-row">
        <p>{APP_BRAND_NAME}</p>
        <p>Developed by Ali Şimşek</p>
      </footer>
    </div>
  )
}

export default App
