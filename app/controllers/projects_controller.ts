import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@adonisjs/core'
import Project from '#models/project'
import ProjectMember from '#models/project_member'
import type Comment from '#models/comment'
import type ActivityLog from '#models/activity_log'
import { createProjectValidator, updateProjectValidator } from '#validators/project'
import type Task from '#models/task'
import type Attachment from '#models/attachment'
import { taskStatuses } from '#validators/task'
import ProjectPolicy from '#policies/project_policy'
import { resolveProjectRole } from '#services/project_access'
import { describeActivity, recordActivity } from '#services/activity_log'
import type User from '#models/user'

export default class ProjectsController {
  private isTaskStatus(value: string): value is (typeof taskStatuses)[number] {
    return taskStatuses.includes(value as (typeof taskStatuses)[number])
  }

  private async findAccessibleProjectOrFail(projectId: number | string, userId: number) {
    const project = await Project.query().where('id', projectId).firstOrFail()

    if (!(await ProjectPolicy.canView(project, userId))) {
      throw new errors.E_HTTP_EXCEPTION(undefined, { status: 404 })
    }

    return project
  }

  private async findManageableProjectOrFail(projectId: number | string, userId: number) {
    const project = await this.findAccessibleProjectOrFail(projectId, userId)

    if (!(await ProjectPolicy.canManageProject(project, userId))) {
      throw new errors.E_HTTP_EXCEPTION(undefined, { status: 404 })
    }

    return project
  }

  private serializeProject(project: Project) {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      createdAt: project.createdAt.toISO() ?? '',
      updatedAt: project.updatedAt.toISO() ?? '',
    }
  }

  private serializeTask(task: Task) {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate?.toISODate() ?? null,
      createdAt: task.createdAt.toISO() ?? '',
      updatedAt: task.updatedAt.toISO() ?? '',
    }
  }

  private serializeUser(user: User) {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      initials: user.initials,
    }
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

  private serializeComment(comment: Comment) {
    return {
      id: comment.id,
      projectId: comment.projectId,
      taskId: comment.taskId,
      body: comment.body,
      createdAt: comment.createdAt.toISO() ?? '',
      user: this.serializeUser(comment.user),
    }
  }

  private serializeActivityLog(activityLog: ActivityLog) {
    return {
      id: activityLog.id,
      projectId: activityLog.projectId,
      taskId: activityLog.taskId,
      commentId: activityLog.commentId,
      action: activityLog.action,
      message: describeActivity(activityLog.action, activityLog.metadata),
      metadata: activityLog.metadata,
      createdAt: activityLog.createdAt.toISO() ?? '',
      user: this.serializeUser(activityLog.user),
    }
  }

  // GET /projects
  public async index({ inertia, auth }: HttpContext) {
    const userId = auth.user!.id

    const projects = await Project.query()
      .where((query) => {
        query.where('user_id', userId)
        query.orWhereIn('id', ProjectMember.query().select('project_id').where('user_id', userId))
      })
      .where('status', '!=', 'archived')
      .orderBy('created_at', 'desc')

    return inertia.render('Projects/Index', {
      projects: projects.map((project) => this.serializeProject(project)),
    })
  }

  // GET /projects/archived
  public async archived({ inertia, auth }: HttpContext) {
    const userId = auth.user!.id

    const projects = await Project.query()
      .where((query) => {
        query.where('user_id', userId)
        query.orWhereIn('id', ProjectMember.query().select('project_id').where('user_id', userId))
      })
      .where('status', 'archived')
      .orderBy('updated_at', 'desc')

    return inertia.render('Projects/Archived', {
      projects: projects.map((project) => this.serializeProject(project)),
    })
  }

  // GET /projects/create
  public async create({ inertia }: HttpContext) {
    return inertia.render('Projects/Create', {})
  }

  // POST /projects
  public async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(createProjectValidator)

    const project = await Project.create({
      ...data,
      userId: auth.user!.id,
      status: 'active',
    })

    await ProjectMember.create({
      projectId: project.id,
      userId: auth.user!.id,
      role: 'admin',
    })

    await recordActivity({
      projectId: project.id,
      actorId: auth.user!.id,
      action: 'project_created',
    })

    return response.redirect().toRoute('projects.index')
  }

  // GET /projects/:id
  public async show({ params, inertia, auth, request }: HttpContext) {
    const project = await this.findAccessibleProjectOrFail(params.id, auth.user!.id)
    const taskStatusFilter = request.input('status')
    const selectedTaskStatus =
      typeof taskStatusFilter === 'string' && this.isTaskStatus(taskStatusFilter)
        ? taskStatusFilter
        : 'all'
    const currentUserRole = await resolveProjectRole(project, auth.user!.id)

    await project.load('members', (membersQuery) => {
      membersQuery.preload('user').orderBy('created_at', 'asc')
    })
    await project.load('user')

    await project.load('tasks', (tasksQuery) => {
      if (selectedTaskStatus !== 'all') {
        tasksQuery.where('status', selectedTaskStatus)
      }

      tasksQuery.orderBy('due_date', 'asc').orderBy('created_at', 'desc')
    })

    await project.load('comments', (commentsQuery) => {
      commentsQuery.preload('user').orderBy('created_at', 'asc')
    })

    await project.load('activityLogs', (activityQuery) => {
      activityQuery.preload('user').orderBy('created_at', 'desc').limit(20)
    })

    await project.load('attachments', (attachmentsQuery) => {
      attachmentsQuery.orderBy('created_at', 'desc')
    })

    return inertia.render(
      'Projects/Show' as never,
      {
        project: this.serializeProject(project),
        tasks: project.tasks.map((task) => this.serializeTask(task)),
        comments: project.comments.map((comment) => this.serializeComment(comment)),
        activityLogs: project.activityLogs.map((activityLog) =>
          this.serializeActivityLog(activityLog)
        ),
        members: project.members
          .filter((member) => member.userId !== project.userId)
          .map((member) => ({
            id: member.id,
            projectId: member.projectId,
            userId: member.userId,
            role: member.role,
            user: {
              id: member.user.id,
              fullName: member.user.fullName,
              email: member.user.email,
              initials: member.user.initials,
            },
          })),
        owner: {
          id: project.user.id,
          fullName: project.user.fullName,
          email: project.user.email,
          initials: project.user.initials,
        },
        currentUserRole,
        canManageMembers: currentUserRole === 'owner' || currentUserRole === 'admin',
        canAttach:
          currentUserRole === 'owner' ||
          currentUserRole === 'admin' ||
          currentUserRole === 'member',
        canManageTasks:
          currentUserRole === 'owner' ||
          currentUserRole === 'admin' ||
          currentUserRole === 'member',
        canManageProject: currentUserRole === 'owner' || currentUserRole === 'admin',
        canComment: currentUserRole !== null,
        attachments: project.attachments.map((attachment) =>
          this.serializeAttachment(attachment)
        ),
        taskStatusFilter: selectedTaskStatus,
        taskStatusOptions: ['all', ...taskStatuses],
      } as never
    )
  }

  // GET /projects/:id/edit
  public async edit({ params, inertia, auth }: HttpContext) {
    const project = await this.findManageableProjectOrFail(params.id, auth.user!.id)
    return inertia.render('Projects/Edit', { project: this.serializeProject(project) })
  }

  // PUT /projects/:id
  public async update({ params, request, response, auth }: HttpContext) {
    const project = await this.findManageableProjectOrFail(params.id, auth.user!.id)
    const data = await request.validateUsing(updateProjectValidator)

    project.merge(data)
    await project.save()

    await recordActivity({
      projectId: project.id,
      actorId: auth.user!.id,
      action: 'project_updated',
    })

    return response.redirect().toRoute('projects.index')
  }

  // PUT /projects/:id/archive
  public async archive({ params, response, auth }: HttpContext) {
    const project = await this.findManageableProjectOrFail(params.id, auth.user!.id)
    project.status = 'archived'
    await project.save()

    await recordActivity({
      projectId: project.id,
      actorId: auth.user!.id,
      action: 'project_archived',
    })

    return response.redirect().toRoute('projects.index')
  }

  // PUT /projects/:id/restore
  public async restore({ params, response, auth }: HttpContext) {
    const project = await this.findManageableProjectOrFail(params.id, auth.user!.id)
    project.status = 'active'
    await project.save()

    await recordActivity({
      projectId: project.id,
      actorId: auth.user!.id,
      action: 'project_restored',
    })

    return response.redirect().toRoute('projects.archived')
  }

  // DELETE /projects/:id
  public async destroy({ params, response, auth }: HttpContext) {
    const project = await this.findManageableProjectOrFail(params.id, auth.user!.id)
    await project.delete()

    return response.redirect().toRoute('projects.index')
  }
}
