import vine from '@vinejs/vine'
import { extname } from 'node:path'

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'application/x-pdf',
  'text/plain',
  'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip',
  'application/gzip',
  'application/json',
]

export const maxFileSize = 10 * 1024 * 1024 // 10MB

export const allowedExtensions = [
  'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg',
  'pdf',
  'txt', 'csv',
  'doc', 'docx',
  'xls', 'xlsx',
  'ppt', 'pptx',
  'zip', 'gz',
  'json',
]

const extensionMimePrefixMap: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  txt: 'text/plain',
  csv: 'text/csv',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  zip: 'application/zip',
  gz: 'application/gzip',
  json: 'application/json',
}

export const createAttachmentValidator = vine.create({
  taskId: vine.number().nullable().optional(),
})

export function isAllowedMimeType(mimeType: string | undefined): boolean {
  if (!mimeType) return false
  return allowedMimeTypes.includes(mimeType)
}

export function isAllowedFileType(mimeType: string | undefined, extension: string | undefined): boolean {
  if (mimeType && allowedMimeTypes.includes(mimeType)) {
    return true
  }
  if (extension) {
    const ext = extname(extension).slice(1).toLowerCase()
    const expectedMime = extensionMimePrefixMap[ext]
    if (expectedMime && mimeType && mimeType.startsWith(expectedMime.split('/')[0] + '/')) {
      return true
    }
    return allowedExtensions.includes(ext)
  }
  return false
}
