import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Project from '#models/project'
import Task from '#models/task'
import ProjectMember from '#models/project_member'

test.group('Tasks', (group) => {
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

  async function createProjectFor(user: User, attributes: Partial<Project> = {}) {
    return Project.create({
      userId: user.id,
      name: attributes.name ?? 'Task Project',
      description: attributes.description ?? 'Project for task tests',
      status: attributes.status ?? 'active',
    })
  }

  async function createTaskFor(project: Project, attributes: Partial<Task> = {}) {
    return Task.create({
      projectId: project.id,
      title: attributes.title ?? 'Initial task',
      description: attributes.description ?? 'Task description',
      status: attributes.status ?? 'todo',
      priority: attributes.priority ?? 'medium',
      dueDate: attributes.dueDate ?? null,
    })
  }

  test('creates a task inside the user project', async ({ client, assert }) => {
    const user = await createUser('owner@example.com')
    const project = await createProjectFor(user)

    const response = await client
      .post(`/projects/${project.id}/tasks`)
      .loginAs(user)
      .form({
        title: 'Plan release',
        description: 'Write the rollout checklist',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2026-06-15',
      })
      .redirects(0)

    response.assertStatus(302)

    const task = await Task.findBy('title', 'Plan release')
    assert.isNotNull(task)
    assert.equal(task!.projectId, project.id)
    assert.equal(task!.status, 'in_progress')
    assert.equal(task!.priority, 'high')
    assert.equal(task!.dueDate?.toISODate(), '2026-06-15')
  })

  test('updates a task in the user project', async ({ client, assert }) => {
    const user = await createUser('owner@example.com')
    const project = await createProjectFor(user)
    const task = await createTaskFor(project, {
      title: 'Initial task',
      status: 'todo',
      priority: 'low',
    })

    const response = await client
      .put(`/projects/${project.id}/tasks/${task.id}`)
      .loginAs(user)
      .form({
        title: 'Updated task',
        description: 'Updated description',
        status: 'done',
        priority: 'medium',
        dueDate: '2026-06-18',
      })
      .redirects(0)

    response.assertStatus(302)

    await task.refresh()
    assert.equal(task.title, 'Updated task')
    assert.equal(task.description, 'Updated description')
    assert.equal(task.status, 'done')
    assert.equal(task.priority, 'medium')
    assert.equal(task.dueDate?.toISODate(), '2026-06-18')
  })

  test('deletes a task from the user project', async ({ client, assert }) => {
    const user = await createUser('owner@example.com')
    const project = await createProjectFor(user)
    const task = await createTaskFor(project)

    const response = await client
      .delete(`/projects/${project.id}/tasks/${task.id}`)
      .loginAs(user)
      .redirects(0)

    response.assertStatus(302)

    const deleted = await Task.find(task.id)
    assert.isNull(deleted)
  })

  test('shows project tasks and filters them by status', async ({ client, assert }) => {
    const user = await createUser('owner@example.com')
    const project = await createProjectFor(user)

    await createTaskFor(project, { title: 'Blocked task', status: 'blocked' })
    await createTaskFor(project, { title: 'Done task', status: 'done' })

    const response = await client.get(`/projects/${project.id}?status=blocked`).loginAs(user)

    response.assertStatus(200)
    response.assertTextIncludes('Blocked task')
    assert.notInclude(response.text(), 'Done task')
  })

  test('rejects invalid task payloads', async ({ client, assert }) => {
    const user = await createUser('owner@example.com')
    const project = await createProjectFor(user)

    const response = await client
      .post(`/projects/${project.id}/tasks`)
      .loginAs(user)
      .form({
        title: '',
        description: 'Invalid task',
        status: 'todo',
      })
      .redirects(0)

    response.assertStatus(302)

    const count = await Task.query().count('* as total').firstOrFail()
    assert.equal(Number(count.$extras.total), 0)
  })

  test('prevents users from creating tasks in projects they do not own', async ({
    client,
    assert,
  }) => {
    const owner = await createUser('owner@example.com')
    const otherUser = await createUser('other@example.com')
    const project = await createProjectFor(owner)

    const response = await client
      .post(`/projects/${project.id}/tasks`)
      .loginAs(otherUser)
      .form({
        title: 'Unauthorized task',
        description: 'Should not exist',
        status: 'todo',
      })
      .redirects(0)

    response.assertStatus(404)

    const count = await Task.query().count('* as total').firstOrFail()
    assert.equal(Number(count.$extras.total), 0)
  })

  test('prevents users from updating tasks in projects they do not own', async ({
    client,
    assert,
  }) => {
    const owner = await createUser('owner@example.com')
    const otherUser = await createUser('other@example.com')
    const project = await createProjectFor(owner)
    const task = await createTaskFor(project, { title: 'Original task', status: 'todo' })

    const response = await client
      .put(`/projects/${project.id}/tasks/${task.id}`)
      .loginAs(otherUser)
      .form({
        title: 'Hijacked task',
        description: 'Nope',
        status: 'done',
      })
      .redirects(0)

    response.assertStatus(404)

    await task.refresh()
    assert.equal(task.title, 'Original task')
    assert.equal(task.status, 'todo')
  })

  test('prevents users from deleting tasks in projects they do not own', async ({
    client,
    assert,
  }) => {
    const owner = await createUser('owner@example.com')
    const otherUser = await createUser('other@example.com')
    const project = await createProjectFor(owner)
    const task = await createTaskFor(project)

    const response = await client
      .delete(`/projects/${project.id}/tasks/${task.id}`)
      .loginAs(otherUser)
      .redirects(0)

    response.assertStatus(404)

    const existingTask = await Task.find(task.id)
    assert.isNotNull(existingTask)
  })

  test('allows member collaborators to manage tasks', async ({ client, assert }) => {
    const owner = await createUser('owner@example.com')
    const collaborator = await createUser('member@example.com')
    const project = await createProjectFor(owner)

    await ProjectMember.create({
      projectId: project.id,
      userId: collaborator.id,
      role: 'member',
    })

    const response = await client
      .post(`/projects/${project.id}/tasks`)
      .loginAs(collaborator)
      .form({
        title: 'Collaborator task',
        description: 'Created by a shared member',
        status: 'todo',
        priority: 'low',
      })
      .redirects(0)

    response.assertStatus(302)

    const task = await Task.findBy('title', 'Collaborator task')
    assert.isNotNull(task)
    assert.equal(task!.projectId, project.id)
  })

  test('prevents viewer collaborators from mutating tasks', async ({ client, assert }) => {
    const owner = await createUser('owner@example.com')
    const viewer = await createUser('viewer@example.com')
    const project = await createProjectFor(owner)

    await ProjectMember.create({
      projectId: project.id,
      userId: viewer.id,
      role: 'viewer',
    })

    const response = await client
      .post(`/projects/${project.id}/tasks`)
      .loginAs(viewer)
      .form({
        title: 'Unauthorized task',
        description: 'Should not be created',
        status: 'todo',
      })
      .redirects(0)

    response.assertStatus(404)

    const count = await Task.query().count('* as total').firstOrFail()
    assert.equal(Number(count.$extras.total), 0)
  })
})
