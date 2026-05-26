import { Link } from '@adonisjs/inertia/react'
import { useForm } from '@inertiajs/react'
import type { FC } from 'react'
import type { JSONDataTypes } from '@adonisjs/core/types/transformers'
import StatusBadge from '~/components/status_badge'

interface Project {
  [key: string]: JSONDataTypes
  id: number
  name: string
  description: string | null
  status: 'active' | 'completed' | 'archived'
}

interface EditProjectProps {
  project: Project
}

const EditProject: FC<EditProjectProps> = ({ project }) => {
  const { data, setData, put, processing, errors } = useForm({
    name: project.name,
    description: project.description || '',
    status: project.status,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    put(`/projects/${project.id}`, { replace: true })
  }

  const descriptionLength = data.description.length

  return (
    <div className="px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] px-5 py-6 shadow-[0_18px_50px_color-mix(in_oklab,var(--gray-12)_10%,transparent)] md:px-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gray-7)]">Projects</p>
          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center">
            <h1 className="text-3xl font-extrabold text-[var(--gray-12)] md:text-4xl">Edit project</h1>
            <StatusBadge status={data.status} />
          </div>
          <p className="mt-2 max-w-2xl text-[var(--gray-7)]">
            Keep the project current so lists, detail views, and later reporting stay trustworthy.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] shadow-[0_18px_50px_color-mix(in_oklab,var(--gray-12)_10%,transparent)]"
        >
          <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-[minmax(0,1.35fr)_320px] lg:gap-8 lg:p-8">
            <section className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-[var(--gray-10)]">
                  Project name
                </label>
                <input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full rounded-lg border border-[var(--gray-4)] bg-[var(--gray-1)] px-4 py-2.5 text-[var(--gray-12)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-9)]"
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  required
                />
                {errors.name && (
                  <p id="name-error" className="mt-1.5 text-sm font-medium text-red-600 dark:text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label htmlFor="description" className="block text-sm font-semibold text-[var(--gray-10)]">
                    Description
                  </label>
                  <span className="text-xs text-[var(--gray-7)]">{descriptionLength}/5000</span>
                </div>
                <textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="min-h-52 w-full rounded-lg border border-[var(--gray-4)] bg-[var(--gray-1)] px-4 py-3 text-[var(--gray-12)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-9)]"
                  aria-invalid={errors.description ? 'true' : 'false'}
                  aria-describedby={errors.description ? 'description-error' : 'description-help'}
                  rows={8}
                />
                {errors.description ? (
                  <p id="description-error" className="mt-1.5 text-sm font-medium text-red-600 dark:text-red-400">
                    {errors.description}
                  </p>
                ) : (
                  <p id="description-help" className="mt-1.5 text-sm text-[var(--gray-7)]">
                    Keep the description concise enough to scan, but detailed enough to be useful later.
                  </p>
                )}
              </div>
            </section>

            <aside className="space-y-4">
              <section className="rounded-lg border border-[var(--gray-3)] bg-[var(--gray-2)] p-4">
                <label htmlFor="status" className="mb-1.5 block text-sm font-semibold text-[var(--gray-10)]">
                  Status
                </label>
                <select
                  id="status"
                  value={data.status}
                  onChange={(e) => setData('status', e.target.value as Project['status'])}
                  className="w-full rounded-lg border border-[var(--gray-4)] bg-[var(--gray-1)] px-3 py-2.5 text-[var(--gray-12)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--brand-9)]"
                  aria-invalid={errors.status ? 'true' : 'false'}
                  aria-describedby={errors.status ? 'status-error' : 'status-help'}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
                {errors.status ? (
                  <p id="status-error" className="mt-1.5 text-sm font-medium text-red-600 dark:text-red-400">
                    {errors.status}
                  </p>
                ) : (
                  <p id="status-help" className="mt-1.5 text-sm text-[var(--gray-7)]">
                    Use completed when work is done, and archived when it no longer needs regular visibility.
                  </p>
                )}
              </section>

              <section className="rounded-lg border border-[var(--gray-3)] bg-[var(--gray-2)] p-4">
                <h2 className="text-sm font-semibold text-[var(--gray-12)]">Editing tips</h2>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--gray-7)]">
                  <li>Short names make list views easier to scan.</li>
                  <li>Descriptions are most useful when they explain purpose and scope.</li>
                  <li>Archive only when the project should leave day-to-day work.</li>
                </ul>
              </section>
            </aside>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[var(--gray-3)] p-4 sm:flex-row sm:items-center sm:justify-end sm:p-5">
            <Link
              href={`/projects/${project.id}`}
              className="inline-flex items-center justify-center rounded-lg border border-[var(--gray-4)] px-5 py-2.5 text-sm font-semibold text-[var(--gray-8)] transition-colors hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center justify-center rounded-lg bg-[var(--brand-9)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-10)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? 'Saving changes...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProject
