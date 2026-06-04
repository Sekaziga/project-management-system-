import { errors } from '@adonisjs/core'
import Project from '#models/project'
import ProjectMember from '#models/project_member'
import type { ProjectMemberRole } from '#validators/project_member'

export type ProjectAccessRole = 'owner' | ProjectMemberRole | null

export async function resolveProjectRole(project: Project, userId: number): Promise<ProjectAccessRole> {
  if (project.userId === userId) {
    return 'owner'
  }

  const membership = await ProjectMember.query()
    .where('project_id', project.id)
    .where('user_id', userId)
    .first()

  return membership ? membership.role : null
}

export async function assertProjectAccess(projectId: number | string, userId: number): Promise<Project> {
  const project = await Project.query().where('id', projectId).firstOrFail()
  const role = await resolveProjectRole(project, userId)

  if (!role) {
    throw new errors.E_HTTP_EXCEPTION(undefined, { status: 404 })
  }

  return project
}

export async function assertProjectManagementAccess(
  projectId: number | string,
  userId: number
): Promise<Project> {
  const project = await assertProjectAccess(projectId, userId)
  const role = await resolveProjectRole(project, userId)

  if (role !== 'owner' && role !== 'admin') {
    throw new errors.E_HTTP_EXCEPTION(undefined, { status: 404 })
  }

  return project
}

export async function assertProjectTaskAccess(
  projectId: number | string,
  userId: number
): Promise<Project> {
  const project = await assertProjectAccess(projectId, userId)
  const role = await resolveProjectRole(project, userId)

  if (role !== 'owner' && role !== 'admin' && role !== 'member') {
    throw new errors.E_HTTP_EXCEPTION(undefined, { status: 404 })
  }

  return project
}

export async function countProjectAdmins(project: Project): Promise<number> {
  const adminMembers = await ProjectMember.query()
    .where('project_id', project.id)
    .where('role', 'admin')

  const ownerCount = project.userId ? 1 : 0

  return adminMembers.reduce((count, member) => {
    return member.userId === project.userId ? count : count + 1
  }, ownerCount)
}
