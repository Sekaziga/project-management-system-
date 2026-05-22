import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import { createProjectValidator, updateProjectValidator } from '#validators/project'

export default class ProjectsController {
  private async findUserProjectOrFail(projectId: number | string, userId: number) {
    return Project.query().where('id', projectId).where('user_id', userId).firstOrFail()
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

  // GET /projects
  public async index({ inertia, auth }: HttpContext) {
    const projects = await Project.query()
      .where('user_id', auth.user!.id)
      .where('status', '!=', 'archived')
      .orderBy('created_at', 'desc')

    return inertia.render('Projects/Index', {
      projects: projects.map((project) => this.serializeProject(project)),
    })
  }

  // GET /projects/archived
  public async archived({ inertia, auth }: HttpContext) {
    const projects = await Project.query()
      .where('user_id', auth.user!.id)
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

    await Project.create({
      ...data,
      userId: auth.user!.id,
      status: 'active',
    })

    return response.redirect().toRoute('projects.index')
  }

  // GET /projects/:id
  public async show({ params, inertia, auth }: HttpContext) {
    const project = await this.findUserProjectOrFail(params.id, auth.user!.id)
    return inertia.render('Projects/Show', { project: this.serializeProject(project) })
  }

  // GET /projects/:id/edit
  public async edit({ params, inertia, auth }: HttpContext) {
    const project = await this.findUserProjectOrFail(params.id, auth.user!.id)
    return inertia.render('Projects/Edit', { project: this.serializeProject(project) })
  }

  // PUT /projects/:id
  public async update({ params, request, response, auth }: HttpContext) {
    const project = await this.findUserProjectOrFail(params.id, auth.user!.id)
    const data = await request.validateUsing(updateProjectValidator)

    project.merge(data)
    await project.save()

    return response.redirect().toRoute('projects.index')
  }

  // PUT /projects/:id/archive
  public async archive({ params, response, auth }: HttpContext) {
    const project = await this.findUserProjectOrFail(params.id, auth.user!.id)
    project.status = 'archived'
    await project.save()

    return response.redirect().toRoute('projects.index')
  }

  // PUT /projects/:id/restore
  public async restore({ params, response, auth }: HttpContext) {
    const project = await this.findUserProjectOrFail(params.id, auth.user!.id)
    project.status = 'active'
    await project.save()

    return response.redirect().toRoute('projects.archived')
  }

  // DELETE /projects/:id
  public async destroy({ params, response, auth }: HttpContext) {
    const project = await this.findUserProjectOrFail(params.id, auth.user!.id)
    await project.delete()

    return response.redirect().toRoute('projects.index')
  }
}
