import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { DateTime } from 'luxon'
import User from '#models/user'
import Project from '#models/project'
import Task from '#models/task'
import ProjectMember from '#models/project_member'

test.group('Dashboard', (group) => {
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
      name: attributes.name ?? 'Dashboard Project',
      description: attributes.description ?? 'Project for dashboard tests',
      status: attributes.status ?? 'active',
    })
  }

  async function createTaskFor(project: Project, attributes: Partial<Task> = {}) {
    return Task.create({
      projectId: project.id,
      title: attributes.title ?? 'Dashboard task',
      description: attributes.description ?? 'Task description',
      status: attributes.status ?? 'todo',
      priority: attributes.priority ?? 'medium',
      dueDate: attributes.dueDate ?? null,
    })
  }

  test('redirects unauthenticated users from the dashboard route', async ({ client }) => {
    const response = await client.get('/dashboard').redirects(0)

    response.assertStatus(302)
  })

  test('shows only the authenticated user data on the dashboard', async ({ client, assert }) => {
    const owner = await createUser('owner@example.com')
    const otherUser = await createUser('other@example.com')

    const activeProject = await createProjectFor(owner, {
      name: 'Active Project',
      status: 'active',
    })
    const completedProject = await createProjectFor(owner, {
      name: 'Completed Project',
      status: 'completed',
    })
    const archivedProject = await createProjectFor(owner, {
      name: 'Archived Project',
      status: 'archived',
    })
    const otherProject = await createProjectFor(otherUser, {
      name: 'Other User Project',
      status: 'active',
    })

    await createTaskFor(activeProject, {
      title: 'Overdue task',
      status: 'todo',
      dueDate: DateTime.fromISO('2026-05-30'),
    })
    await createTaskFor(completedProject, {
      title: 'Finished task',
      status: 'done',
      dueDate: DateTime.fromISO('2026-06-01'),
    })
    await createTaskFor(archivedProject, {
      title: 'Blocked task',
      status: 'blocked',
      dueDate: DateTime.fromISO('2026-05-28'),
    })
    await createTaskFor(otherProject, {
      title: 'Other user task',
      status: 'todo',
      dueDate: DateTime.fromISO('2026-05-29'),
    })

    const response = await client.get('/dashboard').loginAs(owner)

    response.assertStatus(200)
    response.assertTextIncludes('Active Project')
    response.assertTextIncludes('Completed Project')
    response.assertTextIncludes('Archived Project')
    response.assertTextIncludes('Overdue task')
    response.assertTextIncludes('2')
    assert.notInclude(response.text(), 'Other User Project')
    assert.notInclude(response.text(), 'Other user task')
  })

  test('includes shared projects for collaborator access', async ({ client, assert }) => {
    const owner = await createUser('owner@example.com')
    const collaborator = await createUser('collab@example.com')
    const sharedProject = await createProjectFor(owner, {
      name: 'Shared Dashboard Project',
      status: 'active',
    })

    await ProjectMember.create({
      projectId: sharedProject.id,
      userId: collaborator.id,
      role: 'viewer',
    })

    const response = await client.get('/dashboard').loginAs(collaborator)

    response.assertStatus(200)
    response.assertTextIncludes('Shared Dashboard Project')
    assert.notInclude(response.text(), 'Other User Project')
  })
})
