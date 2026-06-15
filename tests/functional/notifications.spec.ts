import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Project from '#models/project'
import ProjectMember from '#models/project_member'
import Notification from '#models/notification'

test.group('Notifications', (group) => {
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
      name: attributes.name ?? 'Notification Test Project',
      description: attributes.description ?? 'A test project for notifications',
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

  test('creates notification when a team member is invited', async ({ client, assert }) => {
    const owner = await createUser('owner@example.com')
    const invitee = await createUser('invitee@example.com')
    const project = await createProjectFor(owner, { name: 'Team Project' }, true)

    const response = await client
      .post(`/projects/${project.id}/members`)
      .loginAs(owner)
      .form({ email: invitee.email, role: 'member' })
      .redirects(0)

    response.assertStatus(302)

    const notification = await Notification.query().where('user_id', invitee.id).firstOrFail()

    assert.equal(notification.type, 'project_invite')
    assert.equal(notification.projectId, project.id)
    assert.equal(notification.actorId, owner.id)
    assert.include(notification.title, 'Team Project')
    assert.include(notification.title, 'member')
    assert.isNull(notification.readAt)
  })

  test('creates notification for project members when a task is created', async ({
    client,
    assert,
  }) => {
    const owner = await createUser('owner@example.com')
    const member = await createUser('member@example.com')
    const project = await createProjectFor(owner, { name: 'Task Project' }, true)

    await ProjectMember.create({
      projectId: project.id,
      userId: member.id,
      role: 'member',
    })

    const response = await client
      .post(`/projects/${project.id}/tasks`)
      .loginAs(owner)
      .form({ title: 'New Task', status: 'todo' })
      .redirects(0)

    response.assertStatus(302)

    const memberNotification = await Notification.query().where('user_id', member.id).firstOrFail()

    assert.equal(memberNotification.type, 'task_created')
    assert.equal(memberNotification.projectId, project.id)
    assert.include(memberNotification.title, 'New Task')

    const ownerNotification = await Notification.query()
      .where('user_id', owner.id)
      .whereNull('read_at')
      .first()

    assert.isNull(ownerNotification)
  })

  test('creates notification for project members when a comment is posted', async ({
    client,
    assert,
  }) => {
    const owner = await createUser('owner@example.com')
    const member = await createUser('member@example.com')
    const project = await createProjectFor(owner, { name: 'Comment Project' }, true)

    await ProjectMember.create({
      projectId: project.id,
      userId: member.id,
      role: 'member',
    })

    const response = await client
      .post(`/projects/${project.id}/comments`)
      .loginAs(member)
      .form({ body: 'Great progress on this project!' })
      .redirects(0)

    response.assertStatus(302)

    const ownerNotification = await Notification.query().where('user_id', owner.id).firstOrFail()

    assert.equal(ownerNotification.type, 'comment_created')
    assert.equal(ownerNotification.projectId, project.id)
    assert.equal(ownerNotification.actorId, member.id)
    assert.include(ownerNotification.title, 'Comment Project')

    const memberNotification = await Notification.query().where('user_id', member.id).first()

    assert.isNull(memberNotification)
  })

  test('lists only the authenticated user notifications', async ({ client, assert }) => {
    const user1 = await createUser('user1@example.com')
    const user2 = await createUser('user2@example.com')
    const project = await createProjectFor(user1, { name: 'Shared Project' }, true)

    await ProjectMember.create({
      projectId: project.id,
      userId: user2.id,
      role: 'member',
    })

    await Notification.create({
      userId: user1.id,
      projectId: project.id,
      type: 'project_invite',
      title: 'Notification for user1',
    })

    await Notification.create({
      userId: user2.id,
      projectId: project.id,
      type: 'project_invite',
      title: 'Notification for user2',
    })

    const response = await client.get('/notifications').loginAs(user1)

    response.assertStatus(200)
    response.assertTextIncludes('Notification for user1')
    assert.notInclude(response.text(), 'Notification for user2')
  })

  test('marks a notification as read', async ({ client, assert }) => {
    const user = await createUser('user@example.com')
    const project = await createProjectFor(user, { name: 'Read Test' }, true)

    const notification = await Notification.create({
      userId: user.id,
      projectId: project.id,
      type: 'project_invite',
      title: 'Read me',
    })

    const response = await client
      .put(`/notifications/${notification.id}/read`)
      .loginAs(user)
      .redirects(0)

    response.assertStatus(302)

    await notification.refresh()
    assert.isNotNull(notification.readAt)
  })

  test('marks all notifications as read', async ({ client, assert }) => {
    const user = await createUser('user@example.com')
    const project = await createProjectFor(user, { name: 'All Read' }, true)

    await Notification.createMany([
      { userId: user.id, projectId: project.id, type: 'project_invite', title: 'One' },
      { userId: user.id, projectId: project.id, type: 'task_created', title: 'Two' },
    ])

    const response = await client.put('/notifications/read-all').loginAs(user).redirects(0)

    response.assertStatus(302)

    const unread = await Notification.query().where('user_id', user.id).whereNull('read_at')

    assert.equal(unread.length, 0)
  })

  test('prevents users from marking another user notification as read', async ({
    client,
    assert,
  }) => {
    const user1 = await createUser('user1@example.com')
    const user2 = await createUser('user2@example.com')
    const project = await createProjectFor(user1, { name: 'Private' }, true)

    const notification = await Notification.create({
      userId: user1.id,
      projectId: project.id,
      type: 'project_invite',
      title: 'Private notification',
    })

    const response = await client
      .put(`/notifications/${notification.id}/read`)
      .loginAs(user2)
      .redirects(0)

    response.assertStatus(404)

    await notification.refresh()
    assert.isNull(notification.readAt)
  })

  test('returns unread count via API', async ({ client, assert }) => {
    const user = await createUser('user@example.com')
    const project = await createProjectFor(user, { name: 'Count Test' }, true)

    await Notification.createMany([
      { userId: user.id, projectId: project.id, type: 'project_invite', title: 'Unread 1' },
      { userId: user.id, projectId: project.id, type: 'task_created', title: 'Unread 2' },
    ])

    const response = await client.get('/notifications/unread-count').loginAs(user)

    response.assertStatus(200)
    assert.equal(response.body().count, 2)
  })
})
