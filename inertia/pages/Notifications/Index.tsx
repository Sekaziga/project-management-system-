import { Link } from '@adonisjs/inertia/react'
import { router } from '@inertiajs/react'
import type { FC } from 'react'

interface NotificationActor {
  id: number
  fullName: string | null
  email: string
  initials: string
}

interface NotificationProject {
  id: number
  name: string
}

interface NotificationItem {
  id: number
  userId: number
  projectId: number | null
  taskId: number | null
  actorId: number | null
  type: string
  title: string
  body: string | null
  metadata: Record<string, unknown> | null
  readAt: string | null
  createdAt: string
  actor: NotificationActor | null
  project: NotificationProject | null
}

interface NotificationsIndexProps {
  notifications: NotificationItem[]
  unreadCount: number
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString()
}

function formatRelativeTime(value: string) {
  const now = new Date()
  const date = new Date(value)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

const NotificationsIndex: FC<NotificationsIndexProps> = ({ notifications, unreadCount }) => {
  function markAsRead(id: number) {
    router.put(`/notifications/${id}/read`, undefined, { preserveScroll: true })
  }

  function markAllAsRead() {
    router.put('/notifications/read-all', undefined, { preserveScroll: true })
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] px-6 py-8 shadow-[0_18px_50px_color-mix(in_oklab,var(--gray-12)_10%,transparent)] md:px-8 md:py-10">
          <div className="relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_color-mix(in_oklab,var(--brand-9)_18%,transparent),_transparent_55%)]" />
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gray-7)]">Notifications</p>
                <h1 className="mt-3 text-3xl font-extrabold text-[var(--gray-12)] md:text-4xl">
                  Stay in the loop.
                </h1>
                <p className="mt-3 max-w-3xl text-[var(--gray-7)]">
                  Review updates about your projects, tasks, and team activity.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="inline-flex items-center justify-center rounded-lg border border-[var(--gray-4)] px-4 py-2.5 text-sm font-semibold text-[var(--gray-8)] transition-colors hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
                  >
                    Mark all as read
                  </button>
                )}
                <span className="rounded-full border border-[var(--gray-4)] bg-[var(--gray-2)] px-2.5 py-1 text-xs font-semibold text-[var(--gray-7)]">
                  {unreadCount} unread
                </span>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_8%,transparent)]">
          {notifications.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--gray-3)]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8 text-[var(--gray-7)]">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
              </div>
              <p className="mt-4 text-lg font-semibold text-[var(--gray-12)]">No notifications yet</p>
              <p className="mt-2 text-sm text-[var(--gray-7)]">
                Activity from your projects and team will show up here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--gray-3)]">
              {notifications.map((notification) => (
                <article
                  key={notification.id}
                  className={`flex items-start gap-4 px-6 py-5 transition-colors hover:bg-[var(--gray-2)] ${
                    !notification.readAt ? 'bg-[var(--brand-9)]/[0.04]' : ''
                  }`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    !notification.readAt
                      ? 'bg-[var(--brand-9)]/15 text-[var(--brand-9)]'
                      : 'bg-[var(--gray-3)] text-[var(--gray-10)]'
                  }`}>
                    {notification.actor?.initials ?? '??'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className={`text-sm ${!notification.readAt ? 'font-bold text-[var(--gray-12)]' : 'font-semibold text-[var(--gray-10)]'}`}>
                          {notification.actor?.fullName || notification.actor?.email || 'Someone'}
                        </p>
                        <p className={`mt-1 text-sm ${!notification.readAt ? 'text-[var(--gray-12)]' : 'text-[var(--gray-8)]'}`}>
                          {notification.title}
                        </p>
                        {notification.project && (
                          <Link
                            href={`/projects/${notification.project.id}`}
                            className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-[var(--gray-4)] bg-[var(--gray-1)] px-2.5 py-1 text-xs font-semibold text-[var(--gray-8)] transition-colors hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                            </svg>
                            {notification.project.name}
                          </Link>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span className="whitespace-nowrap text-xs text-[var(--gray-7)]">
                          {formatRelativeTime(notification.createdAt)}
                        </span>
                        {!notification.readAt && (
                          <button
                            type="button"
                            onClick={() => markAsRead(notification.id)}
                            className="rounded-md border border-[var(--gray-4)] px-2 py-1 text-xs font-semibold text-[var(--gray-7)] transition-colors hover:bg-[var(--gray-3)] hover:text-[var(--gray-12)]"
                          >
                            Read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default NotificationsIndex
