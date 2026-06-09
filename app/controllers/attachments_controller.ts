import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@adonisjs/core'
import { existsSync, mkdirSync, unlinkSync, createReadStream } from 'node:fs'
import { join, extname } from 'node:path'
import { randomUUID } from 'node:crypto'
import Project from '#models/project'
import Attachment from '#models/attachment'
import { createAttachmentValidator, isAllowedFileType, maxFileSize } from '#validators/attachment'
import ProjectPolicy from '#policies/project_policy'
import { recordActivity } from '#services/activity_log'

const uploadsDir = join(process.cwd(), 'tmp', 'uploads')

export default class AttachmentsController {
  private async findAccessibleProjectOrFail(projectId: number | string, userId: number) {
    const project = await Project.query().where('id', projectId).firstOrFail()

    if (!(await ProjectPolicy.canView(project, userId))) {
      throw new errors.E_HTTP_EXCEPTION(undefined, { status: 404 })
    }

    return project
  }

  private async findManageableProjectOrFail(projectId: number | string, userId: number) {
    const project = await this.findAccessibleProjectOrFail(projectId, userId)

    if (!(await ProjectPolicy.canManageTasks(project, userId))) {
      throw new errors.E_HTTP_EXCEPTION(undefined, { status: 404 })
    }

    return project
  }

  private serializeAttachment(attachment: Attachment) {
    return {
      id: attachment.id,
      projectId: attachment.projectId,
      taskId: attachment.taskId,
      userId: attachment.userId,
      fileName: attachment.fileName,
      originalName: attachment.originalName,
      mimeType: attachment.mimeType,
      fileSize: attachment.fileSize,
      createdAt: attachment.createdAt.toISO() ?? '',
    }
  }

  private ensureUploadsDir() {
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true })
    }
  }

  // GET /projects/:projectId/attachments
  public async index({ params, auth }: HttpContext) {
    const project = await this.findAccessibleProjectOrFail(params.projectId, auth.user!.id)

    const query = Attachment.query().where('project_id', project.id).orderBy('created_at', 'desc')

    if (params.taskId) {
      query.where('task_id', params.taskId)
    }

    const attachments = await query

    return attachments.map((attachment) => this.serializeAttachment(attachment))
  }

  // POST /projects/:projectId/attachments
  public async store({ params, request, response, auth, session }: HttpContext) {
    const project = await this.findManageableProjectOrFail(params.projectId, auth.user!.id)
    const data = await request.validateUsing(createAttachmentValidator)

    const file = request.file('file', {
      size: maxFileSize,
      extnames: [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'webp',
        'svg',
        'pdf',
        'txt',
        'csv',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'ppt',
        'pptx',
        'zip',
        'gz',
        'json',
      ],
    })

    if (!file) {
      session.flash('errors', { file: 'File is required' })
      return response.redirect().back()
    }

    if (!file.isValid) {
      const message = file.errors.map((e) => e.message).join(', ')
      session.flash('errors', { file: message })
      return response.redirect().back()
    }

    if (!isAllowedFileType(file.type, file.clientName)) {
      session.flash('errors', { file: 'File type is not allowed' })
      return response.redirect().back()
    }

    this.ensureUploadsDir()

    const ext = extname(file.clientName!)
    const uniqueName = `${randomUUID()}${ext}`

    await file.move(uploadsDir, { name: uniqueName })

    const attachment = await Attachment.create({
      projectId: project.id,
      taskId: data.taskId ?? null,
      userId: auth.user!.id,
      fileName: uniqueName,
      originalName: file.clientName!,
      mimeType: file.type ?? 'application/octet-stream',
      fileSize: file.size!,
    })

    await recordActivity({
      projectId: project.id,
      actorId: auth.user!.id,
      action: 'attachment_added',
      metadata: {
        attachmentId: attachment.id,
        fileName: attachment.originalName,
        taskId: data.taskId ?? null,
      },
    })

    return response.redirect().back()
  }

  // GET /projects/:projectId/attachments/:id/download
  public async show({ params, response, auth }: HttpContext) {
    const project = await this.findAccessibleProjectOrFail(params.projectId, auth.user!.id)
    const attachment = await Attachment.query()
      .where('id', params.id)
      .where('project_id', project.id)
      .firstOrFail()

    const downloadPath = join(uploadsDir, attachment.fileName)

    if (!existsSync(downloadPath)) {
      throw new errors.E_HTTP_EXCEPTION(undefined, { status: 404 })
    }

    response.stream(createReadStream(downloadPath))
    response.header('Content-Type', attachment.mimeType)
    response.header('Content-Disposition', `attachment; filename="${attachment.originalName}"`)
    response.header('Content-Length', attachment.fileSize.toString())

    return response
  }

  // DELETE /projects/:projectId/attachments/:id
  public async destroy({ params, response, auth }: HttpContext) {
    const project = await this.findManageableProjectOrFail(params.projectId, auth.user!.id)
    const attachment = await Attachment.query()
      .where('id', params.id)
      .where('project_id', project.id)
      .firstOrFail()

    const filePath = join(uploadsDir, attachment.fileName)

    if (existsSync(filePath)) {
      unlinkSync(filePath)
    }

    await attachment.delete()

    await recordActivity({
      projectId: project.id,
      actorId: auth.user!.id,
      action: 'attachment_removed',
      metadata: {
        attachmentId: attachment.id,
        fileName: attachment.originalName,
      },
    })

    return response.redirect().back()
  }
}
