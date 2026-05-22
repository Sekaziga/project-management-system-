import { Link } from '@adonisjs/inertia/react'
import { router } from '@inertiajs/react'
import { useState } from 'react'
import type { FC } from 'react'
import type { JSONDataTypes } from '@adonisjs/core/types/transformers'
import ConfirmDialog from '~/components/confirm_dialog'
import StatusBadge from '~/components/status_badge'

interface Project {
  [key: string]: JSONDataTypes
  id: number
  name: string
  description: string | null
  status: 'active' | 'completed' | 'archived'
  createdAt: string
  updatedAt: string
}

interface ProjectsIndexProps {
  projects: Project[]
}

type DialogState =
  | { type: 'archive'; project: Project }
  | { type: 'delete'; project: Project }
  | null

const ProjectsIndex: FC<ProjectsIndexProps> = ({ projects }) => {
  const [dialog, setDialog] = useState<DialogState>(null)
  const [processingAction, setProcessingAction] = useState<string | null>(null)

  function archiveProject(project: Project) {
    setDialog({ type: 'archive', project })
  }

  function deleteProject(project: Project) {
    setDialog({ type: 'delete', project })
  }

  function runAction() {
    if (!dialog) return

    const actionKey = `${dialog.type}-${dialog.project.id}`
    setProcessingAction(actionKey)

    if (dialog.type === 'archive') {
      router.put(`/projects/${dialog.project.id}/archive`, undefined, {
        onFinish: () => {
          setProcessingAction(null)
          setDialog(null)
        },
      })
      return
    }

    router.delete(`/projects/${dialog.project.id}`, {
      onFinish: () => {
        setProcessingAction(null)
        setDialog(null)
      },
    })
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] px-5 py-6 shadow-[0_18px_50px_color-mix(in_oklab,var(--gray-12)_10%,transparent)] md:flex-row md:items-end md:justify-between md:px-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gray-7)]">Projects</p>
            <h1 className="mt-2 text-3xl font-extrabold text-[var(--gray-12)] md:text-4xl">Active projects</h1>
            <p className="mt-2 max-w-2xl text-[var(--gray-7)]">
              Keep current work visible, update progress clearly, and move finished projects out of the way when they no longer need daily attention.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/projects/archived"
              className="inline-flex items-center justify-center rounded-lg border border-[var(--gray-4)] px-4 py-2.5 text-sm font-semibold text-[var(--gray-8)] transition-colors hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
            >
              View archive
            </Link>
            <Link
              href="/projects/create"
              className="inline-flex items-center justify-center rounded-lg bg-[var(--brand-9)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-10)]"
            >
              New project
            </Link>
          </div>
        </header>

        {projects.length === 0 ? (
          <section className="rounded-lg border border-dashed border-[var(--gray-4)] bg-[var(--surface)] p-8 text-center shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_8%,transparent)] md:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gray-2)] text-[var(--gray-7)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-[var(--gray-12)]">No active projects yet</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--gray-7)]">
              Start with a clear project name and short description so your workspace is understandable as soon as the first item appears.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/projects/create"
                className="inline-flex items-center justify-center rounded-lg bg-[var(--brand-9)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-10)]"
              >
                Create the first project
              </Link>
              <Link
                href="/projects/archived"
                className="inline-flex items-center justify-center rounded-lg border border-[var(--gray-4)] px-5 py-3 text-sm font-semibold text-[var(--gray-8)] transition-colors hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
              >
                Browse archive
              </Link>
            </div>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.id}
                className="flex h-full flex-col rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] p-5 shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_8%,transparent)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-[var(--gray-12)]">{project.name}</h2>
                    <p className="mt-1 text-sm text-[var(--gray-7)]">
                      Updated {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>

                <p className="mt-4 flex-1 text-sm leading-6 text-[var(--gray-8)]">
                  {project.description || 'No description yet. Add one to make the project easier to scan later.'}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-center justify-center rounded-lg border border-[var(--gray-4)] px-3 py-2 text-sm font-semibold text-[var(--gray-8)] transition-colors hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
                  >
                    View
                  </Link>
                  <Link
                    href={`/projects/${project.id}/edit`}
                    className="inline-flex items-center justify-center rounded-lg border border-[var(--gray-4)] px-3 py-2 text-sm font-semibold text-[var(--gray-8)] transition-colors hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => archiveProject(project)}
                    disabled={processingAction !== null}
                    className="inline-flex items-center justify-center rounded-lg border border-amber-300/80 px-3 py-2 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-amber-900/60 dark:text-amber-300 dark:hover:bg-amber-900/20"
                  >
                    Archive
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProject(project)}
                    disabled={processingAction !== null}
                    className="inline-flex items-center justify-center rounded-lg border border-red-300/80 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-900/20"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      <ConfirmDialog
        open={dialog !== null}
        title={
          dialog?.type === 'archive'
            ? `Archive ${dialog.project.name}?`
            : dialog
              ? `Delete ${dialog.project.name}?`
              : ''
        }
        description={
          dialog?.type === 'archive'
            ? 'The project will move to the archive and can be restored later.'
            : dialog
              ? 'This permanently deletes the project and removes it from your workspace.'
              : ''
        }
        confirmLabel={dialog?.type === 'archive' ? 'Archive project' : 'Delete project'}
        confirmTone={dialog?.type === 'delete' ? 'danger' : 'primary'}
        loading={dialog ? processingAction === `${dialog.type}-${dialog.project.id}` : false}
        onCancel={() => setDialog(null)}
        onConfirm={runAction}
      />
    </div>
  )
}

export default ProjectsIndex
