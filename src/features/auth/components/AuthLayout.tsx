import type { PropsWithChildren } from 'react'
import { APP_BRAND_NAME } from '../../../shared/constants/brand'

interface AuthLayoutProps extends PropsWithChildren {
  title: string
  subtitle: string
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-10 sm:px-6">
      <div className="grid w-full gap-6 rounded-3xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur lg:grid-cols-2 lg:p-10">
        <section className="flex flex-col justify-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-cyan-300">
            {APP_BRAND_NAME}
          </p>
          <h1 className="text-3xl font-bold text-white md:text-4xl">{title}</h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">{subtitle}</p>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 sm:p-6">
          {children}
        </section>
      </div>
    </main>
  )
}
