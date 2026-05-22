import { Link } from '@adonisjs/inertia/react'
import { useForm } from '@inertiajs/react'

export default function CreateProject() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post('/projects')
  }

  const descriptionLength = data.description.length

  return (
    <div className="px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] px-5 py-6 shadow-[0_18px_50px_color-mix(in_oklab,var(--gray-12)_10%,transparent)] md:px-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gray-7)]">Projects</p>
          <h1 className="mt-2 text-3xl font-extrabold text-[var(--gray-12)] md:text-4xl">Create project</h1>
          <p className="mt-2 max-w-2xl text-[var(--gray-7)]">
            Start with the essentials. A clear name and a short description make the workspace easier to understand immediately.
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
                  placeholder="Marketing website redesign"
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
                  placeholder="Outline the goal, who the project serves, and what success looks like."
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
                    Optional, but helpful when the project list starts growing.
                  </p>
                )}
              </div>
            </section>

            <aside className="space-y-4">
              <section className="rounded-lg border border-[var(--gray-3)] bg-[var(--gray-2)] p-4">
                <h2 className="text-sm font-semibold text-[var(--gray-12)]">Before you create</h2>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--gray-7)]">
                  <li>Use a name people can recognize quickly later.</li>
                  <li>Capture just enough context to avoid guesswork.</li>
                  <li>Status starts as active and can be changed later.</li>
                </ul>
              </section>

              <section className="rounded-lg border border-[var(--gray-3)] bg-[var(--gray-2)] p-4">
                <h2 className="text-sm font-semibold text-[var(--gray-12)]">What happens next</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--gray-7)]">
                  After creation, you can review the detail page, edit the description, and archive the project whenever it leaves active work.
                </p>
              </section>
            </aside>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[var(--gray-3)] p-4 sm:flex-row sm:items-center sm:justify-end sm:p-5">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-lg border border-[var(--gray-4)] px-5 py-2.5 text-sm font-semibold text-[var(--gray-8)] transition-colors hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center justify-center rounded-lg bg-[var(--brand-9)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-10)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? 'Creating project...' : 'Create project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
