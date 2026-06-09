import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@adonisjs/core'
import { ValidationError } from '@vinejs/vine'
import Project from '#models/project'
import ProjectMember from '#models/project_member'
import User from '#models/user'
import ProjectMemberPolicy from '#policies/project_member_policy'
import { countProjectAdmins } from '#services/project_access'
import {
  inviteProjectMemberValidator,
  updateProjectMemberValidator,
} from '#validators/project_member'

export default class ProjectMembersController {
  private async findProjectOrFail(projectId: number | string, userId: number) {
    const project = await Project.query().where('id', projectId).firstOrFail()

    if (!(await ProjectMemberPolicy.canManage(project, userId))) {
      throw new errors.E_HTTP_EXCEPTION(undefined, { status: 404 })
    }

    return project
  }

  private async findMemberOrFail(project: Project, memberId: number | string) {
    return ProjectMember.query()
      .where('id', memberId)
      .where('project_id', project.id)
      .preload('user')
      .firstOrFail()
  }

  public async store({ params, request, response, auth }: HttpContext) {
    const project = await this.findProjectOrFail(params.projectId, auth.user!.id)
    const data = await request.validateUsing(inviteProjectMemberValidator)
    const user = await User.findBy('email', data.email)

    if (!user) {
      throw new ValidationError([
        {
          field: 'email',
          rule: 'exists',
          message: 'No user with that email exists.',
        },
      ])
    }

    if (user.id === project.userId) {
      throw new ValidationError([
        {
          field: 'email',
          rule: 'member',
          message: 'The project owner is already a member.',
        },
      ])
    }

    const existingMembership = await ProjectMember.query()
      .where('project_id', project.id)
      .where('user_id', user.id)
      .first()

    if (existingMembership) {
      throw new ValidationError([
        {
          field: 'email',
          rule: 'member',
          message: 'This user is already a member of the project.',
        },
      ])
    }

    await ProjectMember.create({
      projectId: project.id,
      userId: user.id,
      role: data.role,
    })

    return response.redirect().back()
  }

  public async update({ params, request, response, auth }: HttpContext) {
    const project = await this.findProjectOrFail(params.projectId, auth.user!.id)
    const member = await this.findMemberOrFail(project, params.id)
    const data = await request.validateUsing(updateProjectMemberValidator)

    if (member.userId === project.userId) {
      throw new ValidationError([
        {
          field: 'role',
          rule: 'immutable',
          message: 'The project owner must remain an admin.',
        },
      ])
    }

    const adminCount = await countProjectAdmins(project)
    if (member.role === 'admin' && data.role !== 'admin' && adminCount <= 1) {
      throw new ValidationError([
        {
          field: 'role',
          rule: 'last_admin',
          message: 'At least one admin must remain on the project.',
        },
      ])
    }

    member.role = data.role
    await member.save()

    return response.redirect().back()
  }

  public async destroy({ params, response, auth }: HttpContext) {
    const project = await this.findProjectOrFail(params.projectId, auth.user!.id)
    const member = await this.findMemberOrFail(project, params.id)

    if (member.userId === project.userId) {
      throw new ValidationError([
        {
          field: 'member',
          rule: 'immutable',
          message: 'The project owner cannot be removed.',
        },
      ])
    }

    const adminCount = await countProjectAdmins(project)
    if (member.role === 'admin' && adminCount <= 1) {
      throw new ValidationError([
        {
          field: 'member',
          rule: 'last_admin',
          message: 'At least one admin must remain on the project.',
        },
      ])
    }

    await member.delete()

    return response.redirect().back()
  }
}
