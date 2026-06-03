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

const DashboardController = () => import('#controllers/dashboard_controller')
const ProjectsController = () => import('#controllers/projects_controller')
const TasksController = () => import('#controllers/tasks_controller')

router
  .get('/', async ({ inertia, auth, response }) => {
    const isAuthenticated = await auth.check()

    if (!isAuthenticated) {
      return inertia.render('home', {})
    }

    return response.redirect().toRoute('dashboard')
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

    router.get('/dashboard', [DashboardController, 'index']).as('dashboard')

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

    router.post('/projects/:projectId/tasks', [TasksController, 'store']).as('tasks.store')
    router.put('/projects/:projectId/tasks/:id', [TasksController, 'update']).as('tasks.update')
    router
      .delete('/projects/:projectId/tasks/:id', [TasksController, 'destroy'])
      .as('tasks.destroy')
  })
  .use(middleware.auth())
