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

  return (
    <div className="px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gray-7)]">Projects</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--gray-12)]">Create New Project</h1>
          <p className="text-[var(--gray-7)] max-w-2xl">Set up the essentials for your project. You can update details and status any time later.</p>
        </header>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--gray-3)] bg-[var(--surface)] shadow-[0_18px_50px_color-mix(in_oklab,var(--gray-12)_12%,transparent)]">
          <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-12 md:gap-8 md:p-8">
            <section className="md:col-span-8 space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[var(--gray-10)]">Project Name *</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full rounded-xl border border-[var(--gray-4)] bg-[var(--gray-1)] px-4 py-2.5 text-[var(--gray-12)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-9)]"
                  placeholder="Marketing Website Redesign"
                  required
                />
                {errors.name && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[var(--gray-10)]">Description</label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="min-h-44 w-full rounded-xl border border-[var(--gray-4)] bg-[var(--gray-1)] px-4 py-3 text-[var(--gray-12)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-9)]"
                  placeholder="What is this project about, who is involved, and what outcomes are expected?"
                  rows={7}
                />
              </div>
            </section>

            <aside className="md:col-span-4">
              <div className="rounded-xl border border-[var(--gray-3)] bg-[var(--gray-2)] p-4">
                <h2 className="text-sm font-bold text-[var(--gray-12)]">Before you create</h2>
                <ul className="mt-3 space-y-2 text-sm text-[var(--gray-7)]">
                  <li>- Use a clear and searchable project name.</li>
                  <li>- Add a short purpose to help team context.</li>
                  <li>- You can set status and edit details later.</li>
                </ul>
              </div>
            </aside>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[var(--gray-3)] p-4 md:flex-row md:items-center md:justify-end md:p-5">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-xl border border-[var(--gray-4)] px-5 py-2.5 font-semibold text-[var(--gray-8)] transition-colors hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-9)] px-5 py-2.5 font-semibold text-white transition-colors hover:bg-[var(--brand-10)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
