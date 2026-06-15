import { Link } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'

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

interface NotificationBellProps {
  collapsed: boolean
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

export default function NotificationBell({ collapsed }: NotificationBellProps) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const page = usePage()
  const notificationCount = (page.props as Record<string, unknown>).notificationCount as number | undefined

  useEffect(() => {
    if (typeof notificationCount === 'number') {
      setUnread(notificationCount)
    }
  }, [notificationCount])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  async function toggleDropdown() {
    if (!open) {
      setLoading(true)
      try {
        const res = await fetch('/notifications/recent')
        const data = await res.json()
        setNotifications(data.notifications ?? [])
        setUnread(data.unreadCount ?? 0)
      } catch {
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }

    setOpen(!open)
  }

  function markAsRead(id: number) {
    fetch(`/notifications/${id}/read`, { method: 'PUT' }).then(() => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
      )
      setUnread((prev) => Math.max(0, prev - 1))
    })
  }

  function closeDropdown() {
    setOpen(false)
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className={`relative flex items-center rounded-lg border border-transparent text-[var(--gray-8)] transition-colors hover:text-[var(--gray-12)] hover:bg-[var(--gray-3)] hover:border-[var(--gray-4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-9)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] ${
          collapsed ? 'justify-center p-2.5' : 'w-full px-3 py-2.5 gap-3'
        }`}
        title="Notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        {!collapsed && <span className="text-sm font-semibold">Notifications</span>}
        {unread > 0 && (
          <span className={`inline-flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold ${
            collapsed ? 'absolute -right-0.5 -top-0.5 h-4 min-w-[16px] px-1' : 'ml-auto h-5 min-w-[20px] px-1.5'
          }`}>
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className={`absolute bottom-full left-0 mb-2 z-50 w-80 rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] shadow-2xl ${
          collapsed ? '' : 'left-0'
        }`}>
          <div className="flex items-center justify-between border-b border-[var(--gray-3)] px-4 py-3">
            <p className="text-sm font-semibold text-[var(--gray-12)]">
              Notifications
              {unread > 0 && (
                <span className="ml-2 text-xs font-normal text-[var(--gray-7)]">({unread} unread)</span>
              )}
            </p>
            <Link
              href="/notifications"
              onClick={closeDropdown}
              className="text-xs font-semibold text-[var(--brand-9)] hover:text-[var(--brand-10)]"
            >
              View all
            </Link>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--gray-4)] border-t-[var(--brand-9)]" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-[var(--gray-7)]">No recent notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--gray-3)]">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 transition-colors hover:bg-[var(--gray-2)] ${
                      !notification.readAt ? 'bg-[var(--brand-9)]/[0.04]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className={`text-xs ${!notification.readAt ? 'font-bold text-[var(--gray-12)]' : 'font-semibold text-[var(--gray-10)]'}`}>
                          {notification.actor?.fullName || notification.actor?.email || 'System'}
                        </p>
                        <p className={`mt-0.5 text-xs leading-relaxed ${!notification.readAt ? 'text-[var(--gray-12)]' : 'text-[var(--gray-8)]'}`}>
                          {notification.title}
                        </p>
                      </div>
                      <span className="shrink-0 whitespace-nowrap text-[10px] text-[var(--gray-7)]">
                        {formatRelativeTime(notification.createdAt)}
                      </span>
                    </div>
                    {!notification.readAt && (
                      <button
                        type="button"
                        onClick={() => markAsRead(notification.id)}
                        className="mt-1.5 text-[10px] font-semibold text-[var(--brand-9)] hover:text-[var(--brand-10)]"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
