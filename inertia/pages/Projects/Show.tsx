import { Link } from '@adonisjs/inertia/react'
import type { FC } from 'react'
import type { JSONDataTypes } from '@adonisjs/core/types/transformers'

interface Project {
  [key: string]: JSONDataTypes
  id: number
  name: string
  description: string | null
  status: 'active' | 'completed' | 'archived'
  createdAt: string
  updatedAt: string
}

interface ProjectShowProps {
  project: Project
}

const ProjectShow: FC<ProjectShowProps> = ({ project }) => {
  const statusClasses = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    archived: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <header className="flex flex-col gap-5 rounded-2xl border border-[var(--gray-3)] bg-[var(--surface)] p-5 shadow-[0_10px_28px_color-mix(in_oklab,var(--gray-12)_8%,transparent)] md:flex-row md:items-end md:justify-between md:p-6">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--gray-7)]">Projects</p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--gray-12)]">
              {project.name}
            </h1>
            <p className="max-w-2xl text-[var(--gray-7)]">Project details, status, and timeline in one view.</p>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            <Link
              href={`/projects/${project.id}/edit`}
              className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-9)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-10)]"
            >
              Edit
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-xl border border-[var(--gray-4)] px-4 py-2.5 text-sm font-semibold text-[var(--gray-8)] transition-colors hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
            >
              Back to Projects
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
          <article className="rounded-2xl border border-[var(--gray-3)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_color-mix(in_oklab,var(--gray-12)_12%,transparent)] md:col-span-8 md:p-7">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gray-7)]">
              Description
            </h2>
            <p className="text-[1.02rem] leading-8 text-[var(--gray-10)]">
              {project.description || 'No description provided.'}
            </p>
          </article>

          <aside className="space-y-4 md:col-span-4">
            <article className="rounded-2xl border border-[var(--gray-3)] bg-[var(--surface)] p-5 shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_10%,transparent)]">
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gray-7)]">Status</h2>
              <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusClasses[project.status]}`}>
                {project.status}
              </span>
            </article>

            <article className="rounded-2xl border border-[var(--gray-3)] bg-[var(--surface)] p-5 shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_10%,transparent)]">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gray-7)]">Timeline</h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-[var(--gray-7)]">Created</dt>
                  <dd className="font-medium text-[var(--gray-12)]">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--gray-7)]">Updated</dt>
                  <dd className="font-medium text-[var(--gray-12)]">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </article>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default ProjectShow
