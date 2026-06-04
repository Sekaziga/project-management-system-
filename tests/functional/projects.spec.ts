import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Project from '#models/project'
import ProjectMember from '#models/project_member'

test.group('Projects', (group) => {
  group.each.setup(() => {
    return testUtils.db().truncate()
  })

  async function createUser(email: string) {
    return User.create({
      fullName: 'Test User',
      email,
      password: 'password123',
    })
  }

  async function createProjectFor(
    user: User,
    attributes: Partial<Project> = {},
    withOwnerMembership = false
  ) {
    const project = await Project.create({
      userId: user.id,
      name: attributes.name ?? 'Test Project',
      description: attributes.description ?? 'A test project',
      status: attributes.status ?? 'active',
    })

    if (withOwnerMembership) {
      await ProjectMember.create({
        projectId: project.id,
        userId: user.id,
        role: 'admin',
      })
    }

    return project
  }

  test('redirects unauthenticated users to login', async ({ client }) => {
    const response = await client.get('/projects').redirects(0)

    response.assertStatus(302)
  })

  test('lists projects for authenticated users', async ({ client }) => {
    const user = await createUser('test@example.com')

    await Project.createMany([
      { userId: user.id, name: 'Project A', description: 'Description A', status: 'active' },
      { userId: user.id, name: 'Project B', description: 'Project B', status: 'completed' },
    ])

    const response = await client.get('/projects').loginAs(user)

    response.assertStatus(200)
  })

  test('shows a project by id', async ({ client }) => {
    const user = await createUser('test@example.com')
    const project = await createProjectFor(user, { name: 'My Project' })

    const response = await client.get(`/projects/${project.id}`).loginAs(user)

    response.assertStatus(200)
  })

  test('returns 404 for non-existent project', async ({ client }) => {
    const user = await createUser('test@example.com')

    const response = await client.get('/projects/99999').loginAs(user)

    response.assertStatus(404)
  })

  test('creates a new project with loginAs', async ({ client, assert }) => {
    const user = await createUser('test@example.com')

    const response = await client
      .post('/projects')
      .loginAs(user)
      .form({ name: 'New Project', description: 'New project description' })
      .redirects(0)

    response.assertStatus(302)
    assert.equal(response.header('location'), '/projects')

    const project = await Project.findBy('name', 'New Project')
    assert.isNotNull(project)
    assert.equal(project!.userId, user.id)
  })

  test('updates a project', async ({ client, assert }) => {
    const user = await createUser('test@example.com')
    const project = await createProjectFor(user, {
      name: 'Original Name',
      description: 'Original description',
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
    const user = await createUser('test@example.com')
    const project = await createProjectFor(user, {
      name: 'To Archive',
      description: 'Will be archived',
    })

    const response = await client.put(`/projects/${project.id}/archive`).loginAs(user).redirects(0)

    response.assertStatus(302)
    assert.equal(response.header('location'), '/projects')

    await project.refresh()
    assert.equal(project.status, 'archived')
  })

  test('restores an archived project', async ({ client, assert }) => {
    const user = await createUser('test@example.com')
    const project = await createProjectFor(user, {
      name: 'To Restore',
      description: 'Will be restored',
      status: 'archived',
    })

    const response = await client.put(`/projects/${project.id}/restore`).loginAs(user).redirects(0)

    response.assertStatus(302)
    assert.equal(response.header('location'), '/projects/archived')

    await project.refresh()
    assert.equal(project.status, 'active')
  })

  test('deletes a project', async ({ client, assert }) => {
    const user = await createUser('test@example.com')
    const project = await createProjectFor(user, {
      name: 'To Delete',
      description: 'Will be deleted',
    })

    const response = await client.delete(`/projects/${project.id}`).loginAs(user).redirects(0)

    response.assertStatus(302)
    assert.equal(response.header('location'), '/projects')

    const deleted = await Project.find(project.id)
    assert.isNull(deleted)
  })

  test('renders the create project form', async ({ client }) => {
    const user = await createUser('test@example.com')

    const response = await client.get('/projects/create').loginAs(user)

    response.assertStatus(200)
  })

  test('renders the edit project form', async ({ client }) => {
    const user = await createUser('test@example.com')
    const project = await createProjectFor(user, {
      name: 'Editable Project',
      description: 'Can be edited',
    })

    const response = await client.get(`/projects/${project.id}/edit`).loginAs(user)

    response.assertStatus(200)
  })

  test('does not list archived projects on the active projects page', async ({
    client,
    assert,
  }) => {
    const user = await createUser('test@example.com')

    await createProjectFor(user, { name: 'Active Project', status: 'active' })
    await createProjectFor(user, { name: 'Archived Project', status: 'archived' })

    const response = await client.get('/projects').loginAs(user)

    response.assertStatus(200)
    response.assertTextIncludes('Active Project')
    assert.notInclude(response.text(), 'Archived Project')
  })

  test('rejects invalid project creation payloads', async ({ client, assert }) => {
    const user = await createUser('test@example.com')

    const response = await client
      .post('/projects')
      .loginAs(user)
      .form({ name: '', description: 'Invalid project' })
      .redirects(0)

    response.assertStatus(302)

    const projectCount = await Project.query().count('* as total').firstOrFail()
    assert.equal(Number(projectCount.$extras.total), 0)
  })

  test('rejects invalid project update status', async ({ client, assert }) => {
    const user = await createUser('test@example.com')
    const project = await createProjectFor(user, { status: 'active' })

    const response = await client
      .put(`/projects/${project.id}`)
      .loginAs(user)
      .form({ name: 'Updated Name', description: 'Updated', status: 'invalid' })
      .redirects(0)

    response.assertStatus(302)

    await project.refresh()
    assert.equal(project.status, 'active')
  })

  test('prevents users from accessing projects they do not own', async ({ client }) => {
    const owner = await createUser('owner@example.com')
    const otherUser = await createUser('other@example.com')
    const project = await createProjectFor(owner)

    const response = await client.get(`/projects/${project.id}`).loginAs(otherUser)

    response.assertStatus(404)
  })

  test('prevents users from editing projects they do not own', async ({ client }) => {
    const owner = await createUser('owner@example.com')
    const otherUser = await createUser('other@example.com')
    const project = await createProjectFor(owner)

    const response = await client.get(`/projects/${project.id}/edit`).loginAs(otherUser)

    response.assertStatus(404)
  })

  test('prevents users from updating projects they do not own', async ({ client, assert }) => {
    const owner = await createUser('owner@example.com')
    const otherUser = await createUser('other@example.com')
    const project = await createProjectFor(owner, { name: 'Original Name', status: 'active' })

    const response = await client
      .put(`/projects/${project.id}`)
      .loginAs(otherUser)
      .form({ name: 'Hijacked', description: 'Nope', status: 'completed' })
      .redirects(0)

    response.assertStatus(404)

    await project.refresh()
    assert.equal(project.name, 'Original Name')
    assert.equal(project.status, 'active')
  })

  test('prevents users from archiving projects they do not own', async ({ client, assert }) => {
    const owner = await createUser('owner@example.com')
    const otherUser = await createUser('other@example.com')
    const project = await createProjectFor(owner, { status: 'active' })

    const response = await client
      .put(`/projects/${project.id}/archive`)
      .loginAs(otherUser)
      .redirects(0)

    response.assertStatus(404)

    await project.refresh()
    assert.equal(project.status, 'active')
  })

  test('prevents users from restoring projects they do not own', async ({ client, assert }) => {
    const owner = await createUser('owner@example.com')
    const otherUser = await createUser('other@example.com')
    const project = await createProjectFor(owner, { status: 'archived' })

    const response = await client
      .put(`/projects/${project.id}/restore`)
      .loginAs(otherUser)
      .redirects(0)

    response.assertStatus(404)

    await project.refresh()
    assert.equal(project.status, 'archived')
  })

  test('prevents users from deleting projects they do not own', async ({ client, assert }) => {
    const owner = await createUser('owner@example.com')
    const otherUser = await createUser('other@example.com')
    const project = await createProjectFor(owner)

    const response = await client.delete(`/projects/${project.id}`).loginAs(otherUser).redirects(0)

    response.assertStatus(404)

    const existingProject = await Project.find(project.id)
    assert.isNotNull(existingProject)
  })

  test('allows collaborators to view shared projects', async ({ client }) => {
    const owner = await createUser('owner@example.com')
    const collaborator = await createUser('collab@example.com')
    const project = await createProjectFor(owner, { name: 'Shared Project' })

    await ProjectMember.create({
      projectId: project.id,
      userId: collaborator.id,
      role: 'member',
    })

    const response = await client.get(`/projects/${project.id}`).loginAs(collaborator)

    response.assertStatus(200)
    response.assertTextIncludes('Shared Project')
  })

  test('allows owners to add and remove collaborators', async ({ client, assert }) => {
    const owner = await createUser('owner@example.com')
    const collaborator = await createUser('collaborator@example.com')
    const project = await createProjectFor(owner, { name: 'Team Project' }, true)

    const addResponse = await client
      .post(`/projects/${project.id}/members`)
      .loginAs(owner)
      .form({ email: collaborator.email, role: 'viewer' })
      .redirects(0)

    addResponse.assertStatus(302)

    const membership = await ProjectMember.query()
      .where('project_id', project.id)
      .where('user_id', collaborator.id)
      .firstOrFail()

    assert.equal(membership.role, 'viewer')

    const removeResponse = await client
      .delete(`/projects/${project.id}/members/${membership.id}`)
      .loginAs(owner)
      .redirects(0)

    removeResponse.assertStatus(302)

    const deletedMembership = await ProjectMember.find(membership.id)
    assert.isNull(deletedMembership)
  })

  test('prevents removing the owner collaborator record', async ({ client, assert }) => {
    const owner = await createUser('owner@example.com')
    const project = await createProjectFor(owner, { name: 'Owned Project' }, true)

    const ownerMembership = await ProjectMember.query()
      .where('project_id', project.id)
      .where('user_id', owner.id)
      .firstOrFail()

    const response = await client
      .delete(`/projects/${project.id}/members/${ownerMembership.id}`)
      .loginAs(owner)
      .redirects(0)

    response.assertStatus(302)

    await ownerMembership.refresh()
    assert.equal(ownerMembership.role, 'admin')
  })
})
