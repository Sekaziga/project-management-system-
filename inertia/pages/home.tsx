import { Link } from '@adonisjs/inertia/react'
import type { FC } from 'react'

const Home: FC = () => {
  return (
    <div className="px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,420px)]">
        <section className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] px-6 py-8 shadow-[0_18px_50px_color-mix(in_oklab,var(--gray-12)_10%,transparent)] md:px-8 md:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gray-7)]">
            Project Management System
          </p>
          <h1 className="mt-3 max-w-[14ch] text-4xl font-extrabold leading-tight text-[var(--gray-12)] md:text-5xl">
            Keep project work visible from the first day.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--gray-7)] md:text-lg">
            Create projects, organize active work, and keep finished items tidy without losing the context you still need later.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-[var(--brand-9)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-10)]"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border border-[var(--gray-4)] px-5 py-3 text-sm font-semibold text-[var(--gray-8)] transition-colors hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
            >
              Log in
            </Link>
          </div>
        </section>

        <section className="grid gap-4">
          <article className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] p-5 shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_8%,transparent)]">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gray-7)]">What it handles</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--gray-8)]">
              <li>Project creation, editing, archiving, restore, and cleanup</li>
              <li>Authenticated ownership so each user only sees their own work</li>
              <li>A simple workflow that is ready for tasks, reporting, and collaboration</li>
            </ul>
          </article>

          <article className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] p-5 shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_8%,transparent)]">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gray-7)]">Built for Phase 2</h2>
            <p className="mt-4 text-sm leading-6 text-[var(--gray-8)]">
              The current focus is making the core project workspace polished, legible, and dependable across desktop and mobile.
            </p>
          </article>
        </section>
      </div>
    </div>
  )
}

export default Home
