import { useEffect, useState } from 'react'
import { Form, Link } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import ThemeToggle from './theme-toggle'

interface User {
  initials: string
}

interface SidebarProps {
  user: User | null
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'home', auth: true },
  { href: '/projects', label: 'Projects', icon: 'projects', auth: true },
  { href: '/projects/archived', label: 'Archived', icon: 'archive', auth: true },
  { href: '/login', label: 'Login', icon: 'login', guest: true },
  { href: '/signup', label: 'Signup', icon: 'signup', guest: true },
]

export default function Sidebar({ user }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const currentPath = usePage().url.split('?')[0]

  useEffect(() => {
    setMobileOpen(false)
  }, [currentPath])

  function closeMobile() {
    setMobileOpen(false)
  }

  function isActive(href: string) {
    const hasMoreSpecificMatch = navItems.some((item) => item.href !== href && item.href === currentPath)
    if (hasMoreSpecificMatch) return false

    return currentPath === href || currentPath.startsWith(`${href}/`)
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/55 backdrop-blur-[2px] z-40 md:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col
          bg-[var(--surface)] border-r border-[var(--gray-3)]
          transition-all duration-200 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:relative md:z-auto
          ${collapsed ? 'w-16' : 'w-64'}
        `}
      >
        <div className={`flex items-center h-16 border-b border-[var(--gray-3)] ${collapsed ? 'justify-center' : 'px-5'}`}>
          {collapsed ? (
            <span className="text-lg font-extrabold tracking-tight text-[var(--gray-12)]">PM</span>
          ) : (
            <div className="flex w-full items-center justify-between gap-3">
              <Link href="/" className="min-w-0 text-base font-extrabold tracking-tight text-[var(--gray-12)]" onClick={closeMobile}>
                Project Manager
              </Link>
              <button
                type="button"
                onClick={closeMobile}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--gray-3)] text-[var(--gray-8)] transition-colors hover:bg-[var(--gray-2)] hover:text-[var(--gray-12)] md:hidden"
                aria-label="Close navigation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            if (item.auth && !user) return null
            if (item.guest && user) return null

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobile}
                className={`flex items-center gap-3 rounded-lg border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-9)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]
                  ${isActive(item.href)
                    ? 'border-[color:var(--brand-9)]/25 bg-[color:var(--brand-9)]/15 text-[var(--gray-12)]'
                    : 'border-transparent text-[var(--gray-8)] hover:text-[var(--gray-12)] hover:bg-[var(--gray-3)] hover:border-[var(--gray-4)]'}
                  ${collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'}
                `}
                title={collapsed ? item.label : undefined}
              >
                {item.icon === 'home' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                ) : item.icon === 'login' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0">
                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
                  </svg>
                ) : item.icon === 'signup' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                ) : item.icon === 'archive' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0">
                    <rect x="3" y="4" width="18" height="4" rx="1" />
                    <path d="M5 8v11a2 2 0 002 2h10a2 2 0 002-2V8" />
                    <path d="M10 12h4" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0">
                    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                  </svg>
                )}
                {!collapsed && <span className="text-sm font-semibold">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className={`border-t border-[var(--gray-3)] p-3 space-y-2`}>
          <ThemeToggle collapsed={collapsed} />

          {user && !collapsed && (
            <div className="flex items-center gap-3 rounded-lg border border-[var(--gray-3)] bg-[var(--gray-2)] px-3 py-2.5">
              <div className="w-8 h-8 rounded-full bg-[var(--gray-12)] text-[var(--gray-1)] flex items-center justify-center text-xs font-extrabold">
                {user.initials}
              </div>
              <Form route="session.destroy" className="flex-1">
                <button type="submit" className="text-sm font-semibold text-[var(--gray-8)] hover:text-[var(--gray-12)] transition-colors text-left">
                  Logout
                </button>
              </Form>
            </div>
          )}

          {user && collapsed && (
            <div className="flex justify-center">
              <Form route="session.destroy">
                <button type="submit" className="p-2 text-[var(--gray-8)] hover:text-[var(--gray-12)] transition-colors" title="Logout">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                </button>
              </Form>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden h-8 items-center justify-center border-t border-[var(--gray-3)] text-[var(--gray-8)] transition-colors hover:text-[var(--gray-12)] md:flex"
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-3 z-30 rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] p-2.5 text-[var(--gray-8)] shadow-lg md:hidden"
        aria-label="Open navigation"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </>
  )
}
