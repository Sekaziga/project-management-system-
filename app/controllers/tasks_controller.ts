import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@adonisjs/core'
import { DateTime } from 'luxon'
import Project from '#models/project'
import Task from '#models/task'
import { createTaskValidator, updateTaskValidator } from '#validators/task'
import type { TaskPriority, TaskStatus } from '#validators/task'
import ProjectPolicy from '#policies/project_policy'
import { recordActivity } from '#services/activity_log'

type TaskPayload = {
  title: string
  description?: string | null
  status: TaskStatus
  priority?: TaskPriority | null
  dueDate?: string | null
}

export default class TasksController {
  private async findUserProjectOrFail(projectId: number | string, userId: number) {
    const project = await Project.query().where('id', projectId).firstOrFail()

    if (!(await ProjectPolicy.canView(project, userId))) {
      throw new errors.E_HTTP_EXCEPTION(undefined, { status: 404 })
    }

    return project
  }

  private async findManageableProjectOrFail(projectId: number | string, userId: number) {
    const project = await this.findUserProjectOrFail(projectId, userId)

    if (!(await ProjectPolicy.canManageTasks(project, userId))) {
      throw new errors.E_HTTP_EXCEPTION(undefined, { status: 404 })
    }

    return project
  }

  private async findProjectTaskOrFail(projectId: number | string, taskId: number | string) {
    return Task.query().where('id', taskId).where('project_id', projectId).firstOrFail()
  }

  private normalizeTaskPayload(data: TaskPayload) {
    return {
      title: data.title,
      description: data.description?.trim() || null,
      status: data.status,
      priority: data.priority ?? null,
      dueDate: data.dueDate ? DateTime.fromISO(data.dueDate) : null,
    }
  }

  public async store({ params, request, response, auth }: HttpContext) {
    const project = await this.findManageableProjectOrFail(params.projectId, auth.user!.id)
    const data = await request.validateUsing(createTaskValidator)

    const task = await Task.create({
      projectId: project.id,
      ...this.normalizeTaskPayload(data),
    })

    await recordActivity({
      projectId: project.id,
      taskId: task.id,
      actorId: auth.user!.id,
      action: 'task_created',
      metadata: { taskTitle: task.title },
    })

    return response.redirect().back()
  }

  public async update({ params, request, response, auth }: HttpContext) {
    const project = await this.findManageableProjectOrFail(params.projectId, auth.user!.id)
    const task = await this.findProjectTaskOrFail(project.id, params.id)
    const data = await request.validateUsing(updateTaskValidator)

    task.merge(this.normalizeTaskPayload(data))
    await task.save()

    await recordActivity({
      projectId: project.id,
      taskId: task.id,
      actorId: auth.user!.id,
      action: 'task_updated',
      metadata: { taskTitle: task.title },
    })

    return response.redirect().back()
  }

  public async destroy({ params, response, auth }: HttpContext) {
    const project = await this.findManageableProjectOrFail(params.projectId, auth.user!.id)
    const task = await this.findProjectTaskOrFail(project.id, params.id)

    await recordActivity({
      projectId: project.id,
      taskId: task.id,
      actorId: auth.user!.id,
      action: 'task_deleted',
      metadata: { taskTitle: task.title },
    })

    await task.delete()

    return response.redirect().back()
  }
}
