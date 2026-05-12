import { Link } from '@adonisjs/inertia/react'
import { router } from '@inertiajs/react'

interface Project {
  id: number
  name: string
  description: string
  status: string
  updatedAt?: string
}

export default function ArchivedProjects({ projects }: { projects: Project[] }) {
  function restoreProject(id: number) {
    router.put(`/projects/${id}/restore`)
  }

  function deleteProject(id: number) {
    if (confirm('Delete this archived project permanently?')) {
      router.delete(`/projects/${id}`)
    }
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--gray-7)]">Projects</p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--gray-12)]">Archived Projects</h1>
            <p className="text-[var(--gray-7)] max-w-2xl">A clean archive of inactive work. Restore anything when it becomes relevant again.</p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-xl border border-[var(--gray-4)] px-4 py-2.5 text-sm font-semibold text-[var(--gray-8)] hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
            >
              Active Projects
            </Link>
            <Link
              href="/projects/create"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-9)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-10)]"
            >
              + New Project
            </Link>
          </div>
        </header>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-[var(--gray-3)] bg-[var(--surface)] p-10 text-center shadow-[0_18px_50px_color-mix(in_oklab,var(--gray-12)_12%,transparent)]">
            <p className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gray-2)] text-[var(--gray-7)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                <rect x="3" y="4" width="18" height="4" rx="1" />
                <path d="M5 8v11a2 2 0 002 2h10a2 2 0 002-2V8" />
                <path d="M10 12h4" />
              </svg>
            </p>
            <h2 className="text-xl font-bold text-[var(--gray-12)]">No archived projects</h2>
            <p className="mt-2 text-[var(--gray-7)]">Projects you archive will appear here for quick restore and cleanup.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.id}
                className="rounded-2xl border border-[var(--gray-3)] bg-[var(--surface)] p-5 shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_10%,transparent)]"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h2 className="line-clamp-2 text-lg font-bold text-[var(--gray-12)]">{project.name}</h2>
                  <span className="rounded-full border border-[var(--gray-4)] bg-[var(--gray-2)] px-2.5 py-1 text-xs font-semibold text-[var(--gray-7)]">
                    Archived
                  </span>
                </div>

                <p className="mb-5 line-clamp-3 text-sm text-[var(--gray-7)]">
                  {project.description || 'No description provided.'}
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => restoreProject(project.id)}
                    className="inline-flex items-center justify-center rounded-lg bg-[var(--brand-9)] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[var(--brand-10)]"
                  >
                    Restore
                  </button>
                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center justify-center rounded-lg border border-[var(--gray-4)] px-3 py-1.5 text-sm font-semibold text-[var(--gray-8)] hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
                  >
                    View
                  </Link>
                  <Link
                    href={`/projects/${project.id}/edit`}
                    className="inline-flex items-center justify-center rounded-lg border border-[var(--gray-4)] px-3 py-1.5 text-sm font-semibold text-[var(--gray-8)] hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="inline-flex items-center justify-center rounded-lg border border-red-300/70 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
