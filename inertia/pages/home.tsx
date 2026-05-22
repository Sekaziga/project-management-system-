import { Link } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import type { FC } from 'react'
import StatusBadge from '~/components/status_badge'

interface RecentProject {
  id: number
  name: string
  status: 'active' | 'completed' | 'archived'
  updatedAt: string
}

interface WorkspaceSummary {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  archivedProjects: number
  recentProjects: RecentProject[]
}

interface HomeProps {
  workspace?: WorkspaceSummary
}

interface HomePageData extends HomeProps {
  [key: string]: unknown
  user?: {
    fullName?: string | null
  }
}

const stats = [
  {
    key: 'activeProjects',
    label: 'Active',
    hint: 'Projects that still need attention',
  },
  {
    key: 'completedProjects',
    label: 'Completed',
    hint: 'Work closed out and ready to review',
  },
  {
    key: 'archivedProjects',
    label: 'Archived',
    hint: 'Older work kept for reference',
  },
] as const

const Home: FC<HomeProps> = ({ workspace }) => {
  const page = usePage<HomePageData>()
  const user = page.props.user

  if (!user) {
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

  return (
    <div className="px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] px-6 py-7 shadow-[0_18px_50px_color-mix(in_oklab,var(--gray-12)_10%,transparent)] md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gray-7)]">Workspace</p>
          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-[var(--gray-12)] md:text-4xl">
                Welcome back, {user.fullName || 'there'}.
              </h1>
              <p className="mt-2 max-w-2xl text-[var(--gray-7)]">
                Your current project space is ready. Review active work, check what recently changed, and jump back into the next task.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-lg border border-[var(--gray-4)] px-4 py-2.5 text-sm font-semibold text-[var(--gray-8)] transition-colors hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
              >
                View projects
              </Link>
              <Link
                href="/projects/create"
                className="inline-flex items-center justify-center rounded-lg bg-[var(--brand-9)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-10)]"
              >
                New project
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <article
              key={stat.key}
              className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] p-5 shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_8%,transparent)]"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--gray-7)]">
                {stat.label}
              </p>
              <p className="mt-3 text-3xl font-extrabold text-[var(--gray-12)]">
                {workspace?.[stat.key] ?? 0}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--gray-7)]">{stat.hint}</p>
            </article>
          ))}
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,360px)]">
          <section className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] p-5 shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_8%,transparent)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[var(--gray-12)]">Recently updated</h2>
                <p className="mt-1 text-sm text-[var(--gray-7)]">The latest project activity in your workspace.</p>
              </div>
              <span className="rounded-full border border-[var(--gray-4)] bg-[var(--gray-2)] px-2.5 py-1 text-xs font-semibold text-[var(--gray-7)]">
                {workspace?.totalProjects ?? 0} total
              </span>
            </div>

            {workspace?.recentProjects?.length ? (
              <div className="mt-4 space-y-3">
                {workspace.recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex flex-col gap-3 rounded-lg border border-[var(--gray-3)] bg-[var(--gray-1)] p-4 transition-colors hover:border-[var(--gray-4)] hover:bg-[var(--gray-2)] md:flex-row md:items-center md:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--gray-12)]">{project.name}</p>
                      <p className="mt-1 text-sm text-[var(--gray-7)]">
                        Updated {new Date(project.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={project.status} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-dashed border-[var(--gray-4)] bg-[var(--gray-1)] p-6 text-sm text-[var(--gray-7)]">
                No projects yet. Create the first one to start organizing your workspace.
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <section className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] p-5 shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_8%,transparent)]">
              <h2 className="text-lg font-semibold text-[var(--gray-12)]">Next step</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--gray-7)]">
                Keep project details current so the next phases can build on a clean, trustworthy core.
              </p>
              <Link
                href="/projects/create"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-[var(--brand-9)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-10)]"
              >
                Create a project
              </Link>
            </section>

            <section className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] p-5 shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_8%,transparent)]">
              <h2 className="text-lg font-semibold text-[var(--gray-12)]">Current shape</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--gray-7)]">
                The app currently supports a focused single-user project workflow, with UI cleanup in progress before tasks and reporting land.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Home
