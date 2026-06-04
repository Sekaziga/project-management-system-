import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import Comment from '#models/comment'
import { errors } from '@adonisjs/core'
import { createCommentValidator } from '#validators/comment'
import { recordActivity } from '#services/activity_log'
import ProjectPolicy from '#policies/project_policy'

export default class CommentsController {
  private async findAccessibleProjectOrFail(projectId: number | string, userId: number) {
    const project = await Project.query().where('id', projectId).firstOrFail()

    if (!(await ProjectPolicy.canView(project, userId))) {
      throw new errors.E_HTTP_EXCEPTION(undefined, { status: 404 })
    }

    return project
  }

  public async store({ params, request, response, auth }: HttpContext) {
    const project = await this.findAccessibleProjectOrFail(params.projectId, auth.user!.id)
    const data = await request.validateUsing(createCommentValidator)

    const comment = await Comment.create({
      projectId: project.id,
      taskId: null,
      userId: auth.user!.id,
      body: data.body,
    })

    await recordActivity({
      projectId: project.id,
      commentId: comment.id,
      actorId: auth.user!.id,
      action: 'comment_created',
    })

    return response.redirect().back()
  }
}
