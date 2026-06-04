import Project from '#models/project'
import { resolveProjectRole } from '#services/project_access'

export default class ProjectPolicy {
  static async canView(project: Project, userId: number) {
    return (await resolveProjectRole(project, userId)) !== null
  }

  static async canManageProject(project: Project, userId: number) {
    const role = await resolveProjectRole(project, userId)
    return role === 'owner' || role === 'admin'
  }

  static async canManageTasks(project: Project, userId: number) {
    const role = await resolveProjectRole(project, userId)
    return role === 'owner' || role === 'admin' || role === 'member'
  }

  static async canManageMembers(project: Project, userId: number) {
    const role = await resolveProjectRole(project, userId)
    return role === 'owner' || role === 'admin'
  }
}
