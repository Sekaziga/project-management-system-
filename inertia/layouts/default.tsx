import { Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { ReactElement, useEffect } from 'react'
import Sidebar from '~/components/sidebar'

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  useEffect(() => {
    toast.dismiss()
  }, [usePage().url])

  useEffect(() => {
    if (children.props.flash.error) {
      toast.error(children.props.flash.error)
    }
    if (children.props.flash.success) {
      toast.success(children.props.flash.success)
    }
  })

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')

  return (
    <div className="flex min-h-screen bg-[var(--gray-2)]">
      <Sidebar user={children.props.user ?? null} />
      <div className="flex-1 overflow-y-auto md:overflow-y-visible pt-12 md:pt-0">
        <main>{children}</main>
      </div>
      <Toaster
        position="top-center"
        richColors
        theme={isDark ? 'dark' : 'light'}
      />
    </div>
  )
}
