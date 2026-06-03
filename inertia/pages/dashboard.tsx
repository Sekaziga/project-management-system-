import { Link } from '@adonisjs/inertia/react'
import type { FC } from 'react'
import StatusBadge from '~/components/status_badge'

interface ProjectSummary {
  id: number
  name: string
  status: 'active' | 'completed' | 'archived'
  updatedAt: string
}

interface TaskSummary {
  id: number
  title: string
  status: 'todo' | 'in_progress' | 'blocked' | 'done'
  dueDate: string | null
  project: {
    id: number
    name: string
    status: 'active' | 'completed' | 'archived'
  }
}

interface DashboardSummary {
  projectCounts: {
    active: number
    completed: number
    archived: number
  }
  taskCounts: {
    todo: number
    in_progress: number
    blocked: number
    done: number
  }
  totalProjects: number
  totalTasks: number
  overdueTasks: TaskSummary[]
  recentProjects: ProjectSummary[]
  completedProjects: ProjectSummary[]
  archivedProjects: ProjectSummary[]
}

interface DashboardProps {
  summary: DashboardSummary
}

const projectMetrics = [
  { label: 'Active', key: 'active' as const, hint: 'Open work currently in motion' },
  { label: 'Completed', key: 'completed' as const, hint: 'Work closed out and ready to review' },
  { label: 'Archived', key: 'archived' as const, hint: 'Older work kept for reference' },
] as const

const taskMetrics = [
  { label: 'To do', key: 'todo' as const, hint: 'Not started yet' },
  { label: 'In progress', key: 'in_progress' as const, hint: 'Being actively worked on' },
  { label: 'Blocked', key: 'blocked' as const, hint: 'Waiting on something else' },
  { label: 'Done', key: 'done' as const, hint: 'Finished and ready to archive' },
] as const

const Dashboard: FC<DashboardProps> = ({ summary }) => {
  return (
    <div className="px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header className="overflow-hidden rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] shadow-[0_18px_50px_color-mix(in_oklab,var(--gray-12)_10%,transparent)]">
          <div className="relative px-6 py-8 md:px-8 md:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_color-mix(in_oklab,var(--brand-9)_18%,transparent),_transparent_55%)]" />
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gray-7)]">Dashboard</p>
                <h1 className="mt-3 text-3xl font-extrabold text-[var(--gray-12)] md:text-4xl">
                  Your workspace at a glance.
                </h1>
                <p className="mt-3 max-w-3xl text-[var(--gray-7)]">
                  Review open work, spot overdue items, and jump back into the projects that changed most recently.
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
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] p-5 shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_8%,transparent)]">
            <h2 className="text-lg font-semibold text-[var(--gray-12)]">Projects</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {projectMetrics.map((item) => (
                <div key={item.label} className="rounded-lg border border-[var(--gray-3)] bg-[var(--gray-1)] p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--gray-7)]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-[var(--gray-12)]">
                    {summary.projectCounts[item.key]}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--gray-7)]">{item.hint}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] p-5 shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_8%,transparent)]">
            <h2 className="text-lg font-semibold text-[var(--gray-12)]">Tasks</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {taskMetrics.map((item) => (
                <div key={item.label} className="rounded-lg border border-[var(--gray-3)] bg-[var(--gray-1)] p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--gray-7)]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-[var(--gray-12)]">
                    {summary.taskCounts[item.key]}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--gray-7)]">{item.hint}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,420px)]">
          <article className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] p-5 shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_8%,transparent)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[var(--gray-12)]">Recently updated projects</h2>
                <p className="mt-1 text-sm text-[var(--gray-7)]">The latest project changes in your workspace.</p>
              </div>
              <span className="rounded-full border border-[var(--gray-4)] bg-[var(--gray-2)] px-2.5 py-1 text-xs font-semibold text-[var(--gray-7)]">
                {summary.totalProjects} total
              </span>
            </div>

            {summary.recentProjects.length ? (
              <div className="mt-4 space-y-3">
                {summary.recentProjects.map((project) => (
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
          </article>

          <div className="space-y-4">
            <article className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] p-5 shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_8%,transparent)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--gray-12)]">Overdue tasks</h2>
                  <p className="mt-1 text-sm text-[var(--gray-7)]">Tasks with due dates that are already behind today.</p>
                </div>
                <span className="rounded-full border border-[var(--gray-4)] bg-[var(--gray-2)] px-2.5 py-1 text-xs font-semibold text-[var(--gray-7)]">
                  {summary.overdueTasks.length}
                </span>
              </div>

              {summary.overdueTasks.length ? (
                <div className="mt-4 space-y-3">
                  {summary.overdueTasks.map((task) => (
                    <div key={task.id} className="rounded-lg border border-[var(--gray-3)] bg-[var(--gray-1)] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--gray-12)]">{task.title}</p>
                          <p className="mt-1 text-sm text-[var(--gray-7)]">{task.project.name}</p>
                        </div>
                        <StatusBadge status={task.status} />
                      </div>
                      <p className="mt-2 text-sm text-[var(--gray-7)]">
                        Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'unscheduled'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 rounded-lg border border-dashed border-[var(--gray-4)] bg-[var(--gray-1)] p-6 text-sm text-[var(--gray-7)]">
                  No overdue tasks right now.
                </div>
              )}
            </article>

            <article className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] p-5 shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_8%,transparent)]">
              <h2 className="text-lg font-semibold text-[var(--gray-12)]">Closed project summaries</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-[var(--gray-3)] bg-[var(--gray-1)] p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--gray-7)]">Completed</p>
                  <p className="mt-2 text-3xl font-extrabold text-[var(--gray-12)]">
                    {summary.projectCounts.completed}
                  </p>
                  {summary.completedProjects.length ? (
                    <div className="mt-3 space-y-2">
                      {summary.completedProjects.map((project) => (
                        <Link
                          key={project.id}
                          href={`/projects/${project.id}`}
                          className="block text-sm font-semibold text-[var(--gray-8)] hover:text-[var(--gray-12)]"
                        >
                          {project.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm leading-6 text-[var(--gray-7)]">No completed projects yet.</p>
                  )}
                </div>

                <div className="rounded-lg border border-[var(--gray-3)] bg-[var(--gray-1)] p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--gray-7)]">Archived</p>
                  <p className="mt-2 text-3xl font-extrabold text-[var(--gray-12)]">
                    {summary.projectCounts.archived}
                  </p>
                  {summary.archivedProjects.length ? (
                    <div className="mt-3 space-y-2">
                      {summary.archivedProjects.map((project) => (
                        <Link
                          key={project.id}
                          href={`/projects/${project.id}`}
                          className="block text-sm font-semibold text-[var(--gray-8)] hover:text-[var(--gray-12)]"
                        >
                          {project.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm leading-6 text-[var(--gray-7)]">No archived projects yet.</p>
                  )}
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
