import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Project from '#models/project'
import Task from '#models/task'
import ProjectMember from '#models/project_member'

type ProjectStatus = 'active' | 'completed' | 'archived'
type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done'

export default class DashboardController {
  private serializeProject(project: Project) {
    return {
      id: project.id,
      name: project.name,
      status: project.status,
      updatedAt: project.updatedAt.toISO() ?? '',
    }
  }

  private serializeTask(task: Task) {
    return {
      id: task.id,
      title: task.title,
      status: task.status,
      dueDate: task.dueDate?.toISODate() ?? null,
      project: {
        id: task.project.id,
        name: task.project.name,
        status: task.project.status,
      },
    }
  }

  public async index({ inertia, auth }: HttpContext) {
    const userId = auth.user!.id

    const projects = await Project.query()
      .where((query) => {
        query.where('user_id', userId)
        query.orWhereIn(
          'id',
          ProjectMember.query().select('project_id').where('user_id', userId)
        )
      })
      .orderBy('updated_at', 'desc')

    const projectIds = projects.map((project) => project.id)
    const tasks = projectIds.length
      ? await Task.query()
          .whereIn('project_id', projectIds)
          .preload('project')
          .orderBy('updated_at', 'desc')
      : []

    const projectCounts: Record<ProjectStatus, number> = {
      active: 0,
      completed: 0,
      archived: 0,
    }

    for (const project of projects) {
      projectCounts[project.status] += 1
    }

    const taskCounts: Record<TaskStatus, number> = {
      todo: 0,
      in_progress: 0,
      blocked: 0,
      done: 0,
    }

    for (const task of tasks) {
      taskCounts[task.status] += 1
    }

    const today = DateTime.local().startOf('day')
    const overdueTasks = tasks
      .filter((task) => task.status !== 'done' && task.dueDate !== null && task.dueDate.startOf('day') < today)
      .sort((left, right) => {
        const leftDue = left.dueDate?.toMillis() ?? 0
        const rightDue = right.dueDate?.toMillis() ?? 0

        if (leftDue !== rightDue) {
          return leftDue - rightDue
        }

        return right.updatedAt.toMillis() - left.updatedAt.toMillis()
      })

    const recentProjects = projects.slice(0, 5).map((project) => this.serializeProject(project))
    const completedProjects = projects
      .filter((project) => project.status === 'completed')
      .slice(0, 3)
      .map((project) => this.serializeProject(project))
    const archivedProjects = projects
      .filter((project) => project.status === 'archived')
      .slice(0, 3)
      .map((project) => this.serializeProject(project))

    return inertia.render('dashboard' as never, {
      summary: {
        projectCounts,
        taskCounts,
        totalProjects: projects.length,
        totalTasks: tasks.length,
        overdueTasks: overdueTasks.map((task) => this.serializeTask(task)),
        recentProjects,
        completedProjects,
        archivedProjects,
      },
    } as never)
  }
}
