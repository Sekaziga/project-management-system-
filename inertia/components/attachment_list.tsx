import { router, useForm } from '@inertiajs/react'
import { useState, useRef } from 'react'
import type { FC } from 'react'
import ConfirmDialog from '~/components/confirm_dialog'

interface AttachmentItem {
  id: number
  projectId: number
  taskId: number | null
  userId: number
  fileName: string
  originalName: string
  mimeType: string
  fileSize: number
  createdAt: string
}

interface AttachmentListProps {
  projectId: number
  attachments: AttachmentItem[]
  canAttach: boolean
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return '🖼️'
  if (mimeType === 'application/pdf') return '📄'
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType === 'text/csv')
    return '📊'
  if (mimeType.includes('document') || mimeType.includes('word') || mimeType === 'text/plain')
    return '📝'
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📽️'
  if (mimeType.includes('zip') || mimeType.includes('gzip')) return '📦'
  if (mimeType === 'application/json') return '📋'
  return '📎'
}

const AttachmentList: FC<AttachmentListProps> = ({ projectId, attachments, canAttach }) => {
  const [attachmentToDelete, setAttachmentToDelete] = useState<AttachmentItem | null>(null)
  const [uploadProcessing, setUploadProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadForm = useForm({})

  function uploadFile(e: React.FormEvent) {
    e.preventDefault()

    const input = fileInputRef.current
    if (!input || !input.files || input.files.length === 0) return

    const formData = new FormData()
    formData.append('file', input.files[0])

    setUploadProcessing(true)

    router.post(`/projects/${projectId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      preserveScroll: true,
      onFinish: () => {
        setUploadProcessing(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      },
    })
  }

  function deleteAttachment() {
    if (!attachmentToDelete) return

    router.delete(`/projects/${projectId}/attachments/${attachmentToDelete.id}`, {
      preserveScroll: true,
      onFinish: () => setAttachmentToDelete(null),
    })
  }

  return (
    <>
      <section className="rounded-lg border border-[var(--gray-3)] bg-[var(--surface)] p-5 shadow-[0_12px_35px_color-mix(in_oklab,var(--gray-12)_8%,transparent)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--gray-7)]">
              Attachments
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--gray-7)]">
              Share files, screenshots, and reference documents with the team.
            </p>
          </div>
          {attachments.length > 0 && (
            <span className="rounded-full border border-[var(--gray-4)] bg-[var(--gray-2)] px-2.5 py-1 text-xs font-semibold text-[var(--gray-7)]">
              {attachments.length}
            </span>
          )}
        </div>

        <div className="mt-4 space-y-2">
          {attachments.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--gray-4)] bg-[var(--gray-1)] p-4 text-sm leading-6 text-[var(--gray-7)]">
              No attachments yet. Upload a file to share it with the project.
            </div>
          ) : (
            attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-[var(--gray-3)] bg-[var(--gray-1)] px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="shrink-0 text-lg">{getFileIcon(attachment.mimeType)}</span>
                  <div className="min-w-0">
                    <a
                      href={`/projects/${projectId}/attachments/${attachment.id}/download`}
                      className="truncate text-sm font-semibold text-[var(--gray-12)] hover:text-[var(--brand-9)]"
                      title={attachment.originalName}
                    >
                      {attachment.originalName}
                    </a>
                    <p className="text-xs text-[var(--gray-7)]">
                      {formatFileSize(attachment.fileSize)} &middot;{' '}
                      {new Date(attachment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {canAttach && (
                  <button
                    type="button"
                    onClick={() => setAttachmentToDelete(attachment)}
                    className="inline-flex items-center justify-center rounded-lg border border-red-300/80 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-900/20"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {canAttach && (
          <form onSubmit={uploadFile} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="attachment-file"
                className="mb-1.5 block text-sm font-semibold text-[var(--gray-10)]"
              >
                Upload file
              </label>
              <input
                ref={fileInputRef}
                id="attachment-file"
                type="file"
                className="w-full rounded-lg border border-[var(--gray-4)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--gray-12)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--brand-9)] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[var(--brand-10)]"
              />
              <p className="mt-1.5 text-xs text-[var(--gray-7)]">
                Max 10MB. Allowed: images, PDFs, documents, spreadsheets, and more.
              </p>
            </div>

            <button
              type="submit"
              disabled={uploadProcessing}
              className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--brand-9)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-10)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploadProcessing ? 'Uploading...' : 'Upload file'}
            </button>
          </form>
        )}

        {!canAttach && (
          <div className="mt-5 rounded-lg border border-dashed border-[var(--gray-4)] bg-[var(--gray-1)] p-4 text-sm leading-6 text-[var(--gray-7)]">
            Only project admins and members can upload attachments.
          </div>
        )}
      </section>

      <ConfirmDialog
        open={attachmentToDelete !== null}
        title={
          attachmentToDelete ? `Delete ${attachmentToDelete.originalName}?` : ''
        }
        description="This permanently removes the attachment from the project."
        confirmLabel="Delete attachment"
        confirmTone="danger"
        onCancel={() => setAttachmentToDelete(null)}
        onConfirm={deleteAttachment}
      />
    </>
  )
}

export default AttachmentList
