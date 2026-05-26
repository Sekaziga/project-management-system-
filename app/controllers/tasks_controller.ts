import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Project from '#models/project'
import Task from '#models/task'
import { createTaskValidator, updateTaskValidator } from '#validators/task'
import type { TaskPriority, TaskStatus } from '#validators/task'

type TaskPayload = {
  title: string
  description?: string | null
  status: TaskStatus
  priority?: TaskPriority | null
  dueDate?: string | null
}

export default class TasksController {
  private async findUserProjectOrFail(projectId: number | string, userId: number) {
    return Project.query().where('id', projectId).where('user_id', userId).firstOrFail()
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
    const project = await this.findUserProjectOrFail(params.projectId, auth.user!.id)
    const data = await request.validateUsing(createTaskValidator)

    await Task.create({
      projectId: project.id,
      ...this.normalizeTaskPayload(data),
    })

    return response.redirect().back()
  }

  public async update({ params, request, response, auth }: HttpContext) {
    const project = await this.findUserProjectOrFail(params.projectId, auth.user!.id)
    const task = await this.findProjectTaskOrFail(project.id, params.id)
    const data = await request.validateUsing(updateTaskValidator)

    task.merge(this.normalizeTaskPayload(data))
    await task.save()

    return response.redirect().back()
  }

  public async destroy({ params, response, auth }: HttpContext) {
    const project = await this.findUserProjectOrFail(params.projectId, auth.user!.id)
    const task = await this.findProjectTaskOrFail(project.id, params.id)

    await task.delete()

    return response.redirect().back()
  }
}
