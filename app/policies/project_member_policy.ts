import type Project from '#models/project'
import { resolveProjectRole } from '#services/project_access'

export default class ProjectMemberPolicy {
  static async canManage(project: Project, userId: number) {
    const role = await resolveProjectRole(project, userId)
    return role === 'owner' || role === 'admin'
  }
}
