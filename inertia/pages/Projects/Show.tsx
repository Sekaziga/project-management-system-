import { Link } from '@adonisjs/inertia/react'
import { router, useForm } from '@inertiajs/react'
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
  tasks: Task[]
  taskStatusFilter: TaskFilter
  taskStatusOptions: TaskFilter[]
}

type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done'
type TaskPriority = 'low' | 'medium' | 'high' | ''
type TaskFilter = 'all' | TaskStatus

interface Task {
  [key: string]: JSONDataTypes
  id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: Exclude<TaskPriority, ''> | null
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

type ProjectDialogAction = 'archive' | 'restore' | 'delete' | null

const taskStatusLabels: Record<TaskFilter, string> = {
  all: 'All tasks',
  todo: 'To do',
  in_progress: 'In progress',
  blocked: 'Blocked',
  done: 'Done',
}

const taskWorkflowStatuses: TaskStatus[] = ['todo', 'in_progress', 'blocked', 'done']

const taskPriorityLabels: Record<Exclude<TaskPriority, ''>, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const priorityClasses: Record<Exclude<TaskPriority, ''>, string> = {
  low: 'border-[var(--gray-4)] bg-[var(--gray-2)] text-[var(--gray-8)]',
  medium:
    'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-900/20 dark:text-sky-300',
  high: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-900/20 dark:text-rose-300',
}

const ProjectShow: FC<ProjectShowProps> = ({ project, tasks, taskStatusFilter, taskStatusOptions }) => {
  const [projectDialogAction, setProjectDialogAction] = useState<ProjectDialogAction>(null)
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)
  const [projectActionProcessing, setProjectActionProcessing] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)

  const createForm = useForm({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    priority: '' as TaskPriority,
    dueDate: '',
  })

  const editForm = useForm({
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    priority: '' as TaskPriority,
    dueDate: '',
  })

  function openTaskEditor(task: Task) {
    setEditingTaskId(task.id)
    editForm.setData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority || '',
      dueDate: task.dueDate || '',
    })
    editForm.clearErrors()
  }

  function closeTaskEditor() {
    setEditingTaskId(null)
    editForm.reset()
    editForm.clearErrors()
  }

  function runAction() {
    setProjectActionProcessing(true)

    if (projectDialogAction === 'archive') {
      router.put(`/projects/${project.id}/archive`, undefined, {
        onFinish: () => {
          setProjectActionProcessing(false)
          setProjectDialogAction(null)
        },
      })
      return
    }

    if (projectDialogAction === 'restore') {
      router.put(`/projects/${project.id}/restore`, undefined, {
        onFinish: () => {
          setProjectActionProcessing(false)
          setProjectDialogAction(null)
        },
      })
      return
    }

    router.delete(`/projects/${project.id}`, {
      onFinish: () => {
        setProjectActionProcessing(false)
        setProjectDialogAction(null)
      },
    })
  }

  function createTask(e: React.FormEvent) {
    e.preventDefault()
    createForm.post(`/projects/${project.id}/tasks`, {
      preserveScroll: true,
      onSuccess: () => createForm.reset(),
    })
  }

  function updateTask(e: React.FormEvent, taskId: number) {
    e.preventDefault()
    editForm.put(`/projects/${project.id}/tasks/${taskId}`, {
      preserveScroll: true,
      onSuccess: () => closeTaskEditor(),
    })
  }

  function deleteTask() {
    if (!taskToDelete) return

    router.delete(`/projects/${project.id}/tasks/${taskToDelete.id}`, {
      preserveScroll: true,
      onFinish: () => setTaskToDelete(null),
    })
  }

  function updateTaskStatus(task: Task, status: TaskStatus) {
    router.put(
      `/projects/${project.id}/tasks/${task.id}`,
      {
        title: task.title,
        description: task.description || '',
        status,
        priority: task.priority || '',
        dueDate: task.dueDate || '',
      },
      {
        preserveScroll: true,
      }
    )
  }

  const openTaskCount = tasks.filter((task) => task.status !== 'done').length
  const tasksByStatus = taskWorkflowStatuses.reduce<Record<TaskStatus, number>>(
    (counts, status) => {
      counts[status] = tasks.filter((task) => task.status === status).length
      return counts
    },
    { todo: 0, in_progress: 0, blocked: 0, done: 0 }
  )

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
                  onClick={() => setProjectDialogAction('restore')}
                  className="inline-flex items-center justify-center rounded-lg border border-[var(--gray-4)] px-4 py-2.5 text-sm font-semibold text-[var(--gray-8)] transition-colors hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
                >
                  Restore
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setProjectDialogAction('archive')}
                  className="inline-flex items-center justify-center rounded-lg border border-amber-300/80 px-4 py-2.5 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-50 dark:border-amber-900/60 dark:text-amber-300 dark:hover:bg-amber-900/20"
                >
                  Archive
                </button>
              )}
              <button
                type="button"
                onClick={() => setProjectDialogAction('delete')}
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
          <div className="space-y-4">
            <section className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] p-6 shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_8%,transparent)]">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gray-7)]">Description</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--gray-8)] md:text-[0.98rem]">
                {project.description ||
                  'No description has been added yet. Use the edit flow to capture project goals, scope, and context.'}
              </p>
            </section>

            <section className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_8%,transparent)]">
              <div className="border-b border-[var(--gray-3)] px-6 py-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gray-7)]">Tasks</h2>
                    <p className="mt-2 text-sm text-[var(--gray-7)]">
                      {openTaskCount} open of {tasks.length} shown in this view.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {taskStatusOptions.map((option) => {
                      const active = taskStatusFilter === option
                      return (
                        <Link
                          key={option}
                          href={option === 'all' ? `/projects/${project.id}` : `/projects/${project.id}?status=${option}`}
                          preserveScroll
                          className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                            active
                              ? 'border-[var(--brand-9)] bg-[var(--brand-9)] text-white'
                              : 'border-[var(--gray-4)] bg-[var(--gray-1)] text-[var(--gray-8)] hover:bg-[var(--gray-3)]'
                          }`}
                        >
                          {taskStatusLabels[option]}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[minmax(0,1.2fr)_320px]">
                <div className="space-y-4">
                  {tasks.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-[var(--gray-4)] bg-[var(--gray-1)] px-5 py-8 text-center">
                      <p className="text-base font-semibold text-[var(--gray-12)]">
                        {taskStatusFilter === 'all'
                          ? 'No tasks yet'
                          : `No ${taskStatusLabels[taskStatusFilter].toLowerCase()} in this project`}
                      </p>
                      <p className="mt-2 text-sm text-[var(--gray-7)]">
                        Add the first task to break the project into concrete work.
                      </p>
                    </div>
                  ) : (
                    tasks.map((task) => {
                      const isEditing = editingTaskId === task.id

                      return (
                        <article
                          key={task.id}
                          className="rounded-lg border border-[var(--gray-3)] bg-[var(--gray-1)] p-4"
                        >
                          {isEditing ? (
                            <form onSubmit={(e) => updateTask(e, task.id)} className="space-y-4">
                              <div>
                                <label
                                  htmlFor={`task-title-${task.id}`}
                                  className="mb-1.5 block text-sm font-semibold text-[var(--gray-10)]"
                                >
                                  Task title
                                </label>
                                <input
                                  id={`task-title-${task.id}`}
                                  type="text"
                                  value={editForm.data.title}
                                  onChange={(e) => editForm.setData('title', e.target.value)}
                                  className="w-full rounded-lg border border-[var(--gray-4)] bg-[var(--surface)] px-4 py-2.5 text-[var(--gray-12)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-9)]"
                                />
                                {editForm.errors.title && (
                                  <p className="mt-1.5 text-sm font-medium text-red-600 dark:text-red-400">
                                    {editForm.errors.title}
                                  </p>
                                )}
                              </div>

                              <div>
                                <label
                                  htmlFor={`task-description-${task.id}`}
                                  className="mb-1.5 block text-sm font-semibold text-[var(--gray-10)]"
                                >
                                  Description
                                </label>
                                <textarea
                                  id={`task-description-${task.id}`}
                                  value={editForm.data.description}
                                  onChange={(e) => editForm.setData('description', e.target.value)}
                                  className="min-h-28 w-full rounded-lg border border-[var(--gray-4)] bg-[var(--surface)] px-4 py-3 text-[var(--gray-12)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-9)]"
                                  rows={4}
                                />
                              </div>

                              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                  <label className="mb-1.5 block text-sm font-semibold text-[var(--gray-10)]">
                                    Status
                                  </label>
                                  <select
                                    value={editForm.data.status}
                                    onChange={(e) => editForm.setData('status', e.target.value as TaskStatus)}
                                    className="w-full rounded-lg border border-[var(--gray-4)] bg-[var(--surface)] px-3 py-2.5 text-[var(--gray-12)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-9)]"
                                  >
                                    <option value="todo">To do</option>
                                    <option value="in_progress">In progress</option>
                                    <option value="blocked">Blocked</option>
                                    <option value="done">Done</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="mb-1.5 block text-sm font-semibold text-[var(--gray-10)]">
                                    Priority
                                  </label>
                                  <select
                                    value={editForm.data.priority}
                                    onChange={(e) => editForm.setData('priority', e.target.value as TaskPriority)}
                                    className="w-full rounded-lg border border-[var(--gray-4)] bg-[var(--surface)] px-3 py-2.5 text-[var(--gray-12)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-9)]"
                                  >
                                    <option value="">No priority</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="mb-1.5 block text-sm font-semibold text-[var(--gray-10)]">
                                    Due date
                                  </label>
                                  <input
                                    type="date"
                                    value={editForm.data.dueDate}
                                    onChange={(e) => editForm.setData('dueDate', e.target.value)}
                                    className="w-full rounded-lg border border-[var(--gray-4)] bg-[var(--surface)] px-3 py-2.5 text-[var(--gray-12)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-9)]"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-wrap justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={closeTaskEditor}
                                  className="inline-flex items-center justify-center rounded-lg border border-[var(--gray-4)] px-4 py-2 text-sm font-semibold text-[var(--gray-8)] transition-colors hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  disabled={editForm.processing}
                                  className="inline-flex items-center justify-center rounded-lg bg-[var(--brand-9)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-10)] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {editForm.processing ? 'Saving...' : 'Save task'}
                                </button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-lg font-semibold text-[var(--gray-12)]">{task.title}</h3>
                                    <StatusBadge status={task.status} />
                                    {task.priority && (
                                      <span
                                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${priorityClasses[task.priority]}`}
                                      >
                                        {task.priority}
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-3 text-sm leading-6 text-[var(--gray-8)]">
                                    {task.description || 'No task description yet.'}
                                  </p>
                                </div>

                                <div className="flex shrink-0 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => openTaskEditor(task)}
                                    className="inline-flex items-center justify-center rounded-lg border border-[var(--gray-4)] px-3 py-2 text-sm font-semibold text-[var(--gray-8)] transition-colors hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setTaskToDelete(task)}
                                    className="inline-flex items-center justify-center rounded-lg border border-red-300/80 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-900/20"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>

                              <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--gray-7)]">
                                <div>
                                  <dt className="font-medium text-[var(--gray-8)]">Due</dt>
                                  <dd>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</dd>
                                </div>
                                <div>
                                  <dt className="font-medium text-[var(--gray-8)]">Priority</dt>
                                  <dd>{task.priority ? taskPriorityLabels[task.priority] : 'No priority'}</dd>
                                </div>
                                <div>
                                  <dt className="font-medium text-[var(--gray-8)]">Updated</dt>
                                  <dd>{new Date(task.updatedAt).toLocaleDateString()}</dd>
                                </div>
                              </dl>

                              <div className="mt-4 flex flex-wrap gap-2">
                                {taskWorkflowStatuses.map((status) => {
                                  const active = task.status === status

                                  return (
                                    <button
                                      key={status}
                                      type="button"
                                      disabled={active}
                                      onClick={() => updateTaskStatus(task, status)}
                                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                                        active
                                          ? 'border-[var(--brand-9)] bg-[var(--brand-9)] text-white'
                                          : 'border-[var(--gray-4)] bg-[var(--surface)] text-[var(--gray-8)] hover:bg-[var(--gray-3)]'
                                      }`}
                                    >
                                      Mark {taskStatusLabels[status]}
                                    </button>
                                  )
                                })}
                              </div>
                            </>
                          )}
                        </article>
                      )
                    })
                  )}
                </div>

                <aside className="rounded-lg border border-[var(--gray-3)] bg-[var(--gray-2)] p-5">
                  <h3 className="text-base font-semibold text-[var(--gray-12)]">Add task</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--gray-7)]">
                    Capture the next concrete piece of work directly inside this project.
                  </p>

                  <form onSubmit={createTask} className="mt-5 space-y-4">
                    <div>
                      <label htmlFor="new-task-title" className="mb-1.5 block text-sm font-semibold text-[var(--gray-10)]">
                        Task title
                      </label>
                      <input
                        id="new-task-title"
                        type="text"
                        value={createForm.data.title}
                        onChange={(e) => createForm.setData('title', e.target.value)}
                        className="w-full rounded-lg border border-[var(--gray-4)] bg-[var(--surface)] px-4 py-2.5 text-[var(--gray-12)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-9)]"
                        placeholder="Draft release checklist"
                      />
                      {createForm.errors.title && (
                        <p className="mt-1.5 text-sm font-medium text-red-600 dark:text-red-400">
                          {createForm.errors.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="new-task-description" className="mb-1.5 block text-sm font-semibold text-[var(--gray-10)]">
                        Description
                      </label>
                      <textarea
                        id="new-task-description"
                        value={createForm.data.description}
                        onChange={(e) => createForm.setData('description', e.target.value)}
                        className="min-h-28 w-full rounded-lg border border-[var(--gray-4)] bg-[var(--surface)] px-4 py-3 text-[var(--gray-12)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-9)]"
                        placeholder="Add the context, owner notes, or completion criteria."
                        rows={4}
                      />
                    </div>

                    <div>
                      <label htmlFor="new-task-status" className="mb-1.5 block text-sm font-semibold text-[var(--gray-10)]">
                        Status
                      </label>
                      <select
                        id="new-task-status"
                        value={createForm.data.status}
                        onChange={(e) => createForm.setData('status', e.target.value as TaskStatus)}
                        className="w-full rounded-lg border border-[var(--gray-4)] bg-[var(--surface)] px-3 py-2.5 text-[var(--gray-12)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-9)]"
                      >
                        <option value="todo">To do</option>
                        <option value="in_progress">In progress</option>
                        <option value="blocked">Blocked</option>
                        <option value="done">Done</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="new-task-priority" className="mb-1.5 block text-sm font-semibold text-[var(--gray-10)]">
                          Priority
                        </label>
                        <select
                          id="new-task-priority"
                          value={createForm.data.priority}
                          onChange={(e) => createForm.setData('priority', e.target.value as TaskPriority)}
                          className="w-full rounded-lg border border-[var(--gray-4)] bg-[var(--surface)] px-3 py-2.5 text-[var(--gray-12)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-9)]"
                        >
                          <option value="">No priority</option>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="new-task-due-date" className="mb-1.5 block text-sm font-semibold text-[var(--gray-10)]">
                          Due date
                        </label>
                        <input
                          id="new-task-due-date"
                          type="date"
                          value={createForm.data.dueDate}
                          onChange={(e) => createForm.setData('dueDate', e.target.value)}
                          className="w-full rounded-lg border border-[var(--gray-4)] bg-[var(--surface)] px-3 py-2.5 text-[var(--gray-12)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-9)]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={createForm.processing}
                      className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--brand-9)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-10)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {createForm.processing ? 'Creating task...' : 'Create task'}
                    </button>
                  </form>
                </aside>
              </div>
            </section>
          </div>

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

            <section className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] p-5 shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_8%,transparent)]">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gray-7)]">Task summary</h2>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg border border-[var(--gray-3)] bg-[var(--gray-1)] p-3">
                  <dt className="text-[var(--gray-7)]">Visible tasks</dt>
                  <dd className="mt-1 text-2xl font-bold text-[var(--gray-12)]">{tasks.length}</dd>
                </div>
                <div className="rounded-lg border border-[var(--gray-3)] bg-[var(--gray-1)] p-3">
                  <dt className="text-[var(--gray-7)]">Open tasks</dt>
                  <dd className="mt-1 text-2xl font-bold text-[var(--gray-12)]">{openTaskCount}</dd>
                </div>
              </dl>
              <div className="mt-4 space-y-3">
                {taskWorkflowStatuses.map((status) => (
                  <div
                    key={status}
                    className="rounded-lg border border-[var(--gray-3)] bg-[var(--gray-1)] px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-[var(--gray-8)]">{taskStatusLabels[status]}</span>
                      <span className="text-base font-bold text-[var(--gray-12)]">{tasksByStatus[status]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>

      <ConfirmDialog
        open={projectDialogAction !== null}
        title={
          projectDialogAction === 'archive'
            ? `Archive ${project.name}?`
            : projectDialogAction === 'restore'
              ? `Restore ${project.name}?`
              : projectDialogAction === 'delete'
                ? `Delete ${project.name}?`
                : ''
        }
        description={
          projectDialogAction === 'archive'
            ? 'The project will move to the archive and can still be restored later.'
            : projectDialogAction === 'restore'
              ? 'The project will return to the active workspace.'
              : projectDialogAction === 'delete'
                ? 'This permanently deletes the project and removes it from your workspace.'
                : ''
        }
        confirmLabel={
          projectDialogAction === 'archive'
            ? 'Archive project'
            : projectDialogAction === 'restore'
              ? 'Restore project'
              : 'Delete project'
        }
        confirmTone={projectDialogAction === 'delete' ? 'danger' : 'primary'}
        loading={projectActionProcessing}
        onCancel={() => setProjectDialogAction(null)}
        onConfirm={runAction}
      />

      <ConfirmDialog
        open={taskToDelete !== null}
        title={taskToDelete ? `Delete ${taskToDelete.title}?` : ''}
        description="This permanently deletes the task from the project."
        confirmLabel="Delete task"
        confirmTone="danger"
        onCancel={() => setTaskToDelete(null)}
        onConfirm={deleteTask}
      />
    </div>
  )
}

export default ProjectShow
