/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'
import Project from '#models/project'

const ProjectsController = () => import('#controllers/projects_controller')

router
  .get('/', async ({ inertia, auth }) => {
    const isAuthenticated = await auth.check()

    if (!isAuthenticated) {
      return inertia.render('home', {})
    }

    const projects = await Project.query().where('user_id', auth.user!.id)
    const activeProjects = projects.filter((project) => project.status === 'active')
    const completedProjects = projects.filter((project) => project.status === 'completed')
    const archivedProjects = projects.filter((project) => project.status === 'archived')
    const recentProjects = [...projects]
      .sort((left, right) => right.updatedAt.toMillis() - left.updatedAt.toMillis())
      .slice(0, 3)
      .map((project) => ({
        id: project.id,
        name: project.name,
        status: project.status,
        updatedAt: project.updatedAt.toISO() ?? '',
      }))

    return inertia.render('home', {
      workspace: {
        totalProjects: projects.length,
        activeProjects: activeProjects.length,
        completedProjects: completedProjects.length,
        archivedProjects: archivedProjects.length,
        recentProjects,
      },
    })
  })
  .as('home')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create']).as('signup.create')
    router.post('signup', [controllers.NewAccount, 'store']).as('signup.store')

    router.get('login', [controllers.Session, 'create']).as('session.create')
    router.post('login', [controllers.Session, 'store']).as('session.store')
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy']).as('session.destroy')

    // Projects routes
    router.get('/projects', [ProjectsController, 'index']).as('projects.index')
    router.get('/projects/archived', [ProjectsController, 'archived']).as('projects.archived')
    router.get('/projects/create', [ProjectsController, 'create']).as('projects.create')
    router.post('/projects', [ProjectsController, 'store']).as('projects.store')
    router.get('/projects/:id', [ProjectsController, 'show']).as('projects.show')
    router.get('/projects/:id/edit', [ProjectsController, 'edit']).as('projects.edit')
    router.put('/projects/:id', [ProjectsController, 'update']).as('projects.update')
    router.put('/projects/:id/archive', [ProjectsController, 'archive']).as('projects.archive')
    router.put('/projects/:id/restore', [ProjectsController, 'restore']).as('projects.restore')
    router.delete('/projects/:id', [ProjectsController, 'destroy']).as('projects.destroy')
  })
  .use(middleware.auth())
