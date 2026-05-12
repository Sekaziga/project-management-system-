import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'

export default class ProjectsController {
  // GET /projects
  public async index({ inertia, auth }: HttpContext) {
    const projects = await Project.query()
      .where('user_id', auth.user!.id)
      .where('status', '!=', 'archived')
      .orderBy('created_at', 'desc')

    return inertia.render('Projects/Index', { projects })
  }

  // GET /projects/create
  public async create({ inertia }: HttpContext) {
    return inertia.render('Projects/Create', {})
  }

  // POST /projects
  public async store({ request, response, auth }: HttpContext) {
    const data = request.only(['name', 'description'])

    await Project.create({
      ...data,
      userId: auth.user!.id,
      status: 'active',
    })

    return response.redirect('/projects')
  }

  // GET /projects/:id
  public async show({ params, inertia }: HttpContext) {
    const project = await Project.findOrFail(params.id)
    return inertia.render('Projects/Show', { project: project.serialize() })
  }

  // GET /projects/:id/edit
  public async edit({ params, inertia }: HttpContext) {
    const project = await Project.findOrFail(params.id)
    return inertia.render('Projects/Edit', { project: project.serialize() })
  }

  // PUT /projects/:id
  public async update({ params, request, response }: HttpContext) {
    const project = await Project.findOrFail(params.id)
    const data = request.only(['name', 'description', 'status'])

    project.merge(data)
    await project.save()

    return response.redirect('/projects')
  }

  // PUT /projects/:id/archive
  public async archive({ params, response }: HttpContext) {
    const project = await Project.findOrFail(params.id)
    project.status = 'archived'
    await project.save()

    return response.redirect('/projects')
  }

  // DELETE /projects/:id
  public async destroy({ params, response }: HttpContext) {
    const project = await Project.findOrFail(params.id)
    await project.delete()

    return response.redirect('/projects')
  }
}
