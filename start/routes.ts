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

const ProjectsController = () => import('#controllers/projects_controller')

router.on('/').renderInertia('home', {}).as('home')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])

    // Projects routes
    router.get('/projects', [ProjectsController, 'index'])
    router.get('/projects/create', [ProjectsController, 'create'])
    router.post('/projects', [ProjectsController, 'store'])
    router.get('/projects/:id', [ProjectsController, 'show'])
    router.get('/projects/:id/edit', [ProjectsController, 'edit'])
    router.put('/projects/:id', [ProjectsController, 'update'])
    router.put('/projects/:id/archive', [ProjectsController, 'archive'])
    router.delete('/projects/:id', [ProjectsController, 'destroy'])
  })
  .use(middleware.auth())
