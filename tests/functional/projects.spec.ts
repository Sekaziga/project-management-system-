import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Project from '#models/project'

test.group('Projects', (group) => {
  group.each.setup(() => {
    return testUtils.db().truncate()
  })

  test('redirects unauthenticated users to login', async ({ client }) => {
    const response = await client.get('/projects').redirects(0)

    response.assertStatus(302)
  })

  test('lists projects for authenticated users', async ({ client }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    await Project.createMany([
      { userId: user.id, name: 'Project A', description: 'Description A', status: 'active' },
      { userId: user.id, name: 'Project B', description: 'Project B', status: 'completed' },
    ])

    const response = await client.get('/projects').loginAs(user)

    response.assertStatus(200)
  })

  test('shows a project by id', async ({ client }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const project = await Project.create({
      userId: user.id,
      name: 'My Project',
      description: 'A test project',
      status: 'active',
    })

    const response = await client.get(`/projects/${project.id}`).loginAs(user)

    response.assertStatus(200)
  })

  test('returns 404 for non-existent project', async ({ client }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const response = await client.get('/projects/99999').loginAs(user)

    response.assertStatus(404)
  })

  test('creates a new project with loginAs', async ({ client, assert }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const response = await client
      .post('/projects')
      .loginAs(user)
      .form({ name: 'New Project', description: 'New project description' })
      .redirects(0)

    console.log('POST form:', response.status(), 'location:', response.header('location'))

    response.assertStatus(302)
    assert.equal(response.header('location'), '/projects')

    const project = await Project.findBy('name', 'New Project')
    assert.isNotNull(project)
    assert.equal(project!.userId, user.id)
  })

  test('updates a project', async ({ client, assert }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const project = await Project.create({
      userId: user.id,
      name: 'Original Name',
      description: 'Original description',
      status: 'active',
    })

    const response = await client
      .put(`/projects/${project.id}`)
      .loginAs(user)
      .form({ name: 'Updated Name', description: 'Updated description', status: 'completed' })
      .redirects(0)

    response.assertStatus(302)
    assert.equal(response.header('location'), '/projects')

    await project.refresh()
    assert.equal(project.name, 'Updated Name')
    assert.equal(project.description, 'Updated description')
    assert.equal(project.status, 'completed')
  })

  test('archives a project', async ({ client, assert }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const project = await Project.create({
      userId: user.id,
      name: 'To Archive',
      description: 'Will be archived',
      status: 'active',
    })

    const response = await client.put(`/projects/${project.id}/archive`).loginAs(user).redirects(0)

    response.assertStatus(302)
    assert.equal(response.header('location'), '/projects')

    await project.refresh()
    assert.equal(project.status, 'archived')
  })

  test('deletes a project', async ({ client, assert }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const project = await Project.create({
      userId: user.id,
      name: 'To Delete',
      description: 'Will be deleted',
      status: 'active',
    })

    const response = await client.delete(`/projects/${project.id}`).loginAs(user).redirects(0)

    response.assertStatus(302)
    assert.equal(response.header('location'), '/projects')

    const deleted = await Project.find(project.id)
    assert.isNull(deleted)
  })

  test('renders the create project form', async ({ client }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const response = await client.get('/projects/create').loginAs(user)

    response.assertStatus(200)
  })

  test('renders the edit project form', async ({ client }) => {
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    const project = await Project.create({
      userId: user.id,
      name: 'Editable Project',
      description: 'Can be edited',
      status: 'active',
    })

    const response = await client.get(`/projects/${project.id}/edit`).loginAs(user)

    response.assertStatus(200)
  })
})
