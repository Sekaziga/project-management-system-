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

interface ProjectShowProps {
  project: Project
}

type DialogAction = 'archive' | 'restore' | 'delete' | null

const ProjectShow: FC<ProjectShowProps> = ({ project }) => {
  const [dialogAction, setDialogAction] = useState<DialogAction>(null)
  const [processing, setProcessing] = useState(false)

  function runAction() {
    setProcessing(true)

    if (dialogAction === 'archive') {
      router.put(`/projects/${project.id}/archive`, undefined, {
        onFinish: () => {
          setProcessing(false)
          setDialogAction(null)
        },
      })
      return
    }

    if (dialogAction === 'restore') {
      router.put(`/projects/${project.id}/restore`, undefined, {
        onFinish: () => {
          setProcessing(false)
          setDialogAction(null)
        },
      })
      return
    }

    router.delete(`/projects/${project.id}`, {
      onFinish: () => {
        setProcessing(false)
        setDialogAction(null)
      },
    })
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] px-5 py-6 shadow-[0_18px_50px_color-mix(in_oklab,var(--gray-12)_10%,transparent)] md:px-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gray-7)]">Projects</p>
              <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center">
                <h1 className="truncate text-3xl font-extrabold text-[var(--gray-12)] md:text-4xl">{project.name}</h1>
                <StatusBadge status={project.status} />
              </div>
              <p className="mt-3 max-w-3xl text-[var(--gray-7)]">
                Review project context, track current status, and make the next project-level decision without leaving the page.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 xl:justify-end">
              <Link
                href={`/projects/${project.id}/edit`}
                className="inline-flex items-center justify-center rounded-lg bg-[var(--brand-9)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-10)]"
              >
                Edit project
              </Link>
              {project.status === 'archived' ? (
                <button
                  type="button"
                  onClick={() => setDialogAction('restore')}
                  className="inline-flex items-center justify-center rounded-lg border border-[var(--gray-4)] px-4 py-2.5 text-sm font-semibold text-[var(--gray-8)] transition-colors hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
                >
                  Restore
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setDialogAction('archive')}
                  className="inline-flex items-center justify-center rounded-lg border border-amber-300/80 px-4 py-2.5 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-50 dark:border-amber-900/60 dark:text-amber-300 dark:hover:bg-amber-900/20"
                >
                  Archive
                </button>
              )}
              <button
                type="button"
                onClick={() => setDialogAction('delete')}
                className="inline-flex items-center justify-center rounded-lg border border-red-300/80 px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-900/20"
              >
                Delete
              </button>
              <Link
                href={project.status === 'archived' ? '/projects/archived' : '/projects'}
                className="inline-flex items-center justify-center rounded-lg border border-[var(--gray-4)] px-4 py-2.5 text-sm font-semibold text-[var(--gray-8)] transition-colors hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
              >
                Back
              </Link>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,360px)]">
          <section className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] p-6 shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_8%,transparent)]">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gray-7)]">Description</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--gray-8)] md:text-[0.98rem]">
              {project.description || 'No description has been added yet. Use the edit flow to capture project goals, scope, and context.'}
            </p>
          </section>

          <aside className="space-y-4">
            <section className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] p-5 shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_8%,transparent)]">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gray-7)]">Timeline</h2>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-[var(--gray-7)]">Created</dt>
                  <dd className="mt-1 font-semibold text-[var(--gray-12)]">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--gray-7)]">Last updated</dt>
                  <dd className="mt-1 font-semibold text-[var(--gray-12)]">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] p-5 shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_8%,transparent)]">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gray-7)]">Current state</h2>
              <p className="mt-4 text-sm leading-6 text-[var(--gray-8)]">
                {project.status === 'active'
                  ? 'This project is part of the active workspace and should stay easy to scan and update.'
                  : project.status === 'completed'
                    ? 'This project is marked complete and can be archived when it no longer needs regular visibility.'
                    : 'This project is archived and can be restored if it becomes relevant again.'}
              </p>
            </section>
          </aside>
        </div>
      </div>

      <ConfirmDialog
        open={dialogAction !== null}
        title={
          dialogAction === 'archive'
            ? `Archive ${project.name}?`
            : dialogAction === 'restore'
              ? `Restore ${project.name}?`
              : dialogAction === 'delete'
                ? `Delete ${project.name}?`
                : ''
        }
        description={
          dialogAction === 'archive'
            ? 'The project will move to the archive and can still be restored later.'
            : dialogAction === 'restore'
              ? 'The project will return to the active workspace.'
              : dialogAction === 'delete'
                ? 'This permanently deletes the project and removes it from your workspace.'
                : ''
        }
        confirmLabel={
          dialogAction === 'archive'
            ? 'Archive project'
            : dialogAction === 'restore'
              ? 'Restore project'
              : 'Delete project'
        }
        confirmTone={dialogAction === 'delete' ? 'danger' : 'primary'}
        loading={processing}
        onCancel={() => setDialogAction(null)}
        onConfirm={runAction}
      />
    </div>
  )
}

export default ProjectShow
