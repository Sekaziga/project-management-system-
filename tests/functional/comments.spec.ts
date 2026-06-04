import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'
import Project from '#models/project'
import ProjectMember from '#models/project_member'
import Comment from '#models/comment'
import ActivityLog from '#models/activity_log'

test.group('Comments', (group) => {
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

  async function createProjectFor(user: User) {
    return Project.create({
      userId: user.id,
      name: 'Comment Project',
      description: 'Project for comment tests',
      status: 'active',
    })
  }

  test('allows authorized users to comment and records activity', async ({ client, assert }) => {
    const owner = await createUser('owner@example.com')
    const viewer = await createUser('viewer@example.com')
    const project = await createProjectFor(owner)

    await ProjectMember.create({
      projectId: project.id,
      userId: viewer.id,
      role: 'viewer',
    })

    const response = await client
      .post(`/projects/${project.id}/comments`)
      .loginAs(viewer)
      .form({
        body: 'This looks ready to ship.',
      })
      .redirects(0)

    response.assertStatus(302)

    const comment = await Comment.findBy('body', 'This looks ready to ship.')
    assert.isNotNull(comment)
    assert.equal(comment!.projectId, project.id)
    assert.equal(comment!.userId, viewer.id)

    const activity = await ActivityLog.query()
      .where('project_id', project.id)
      .orderBy('created_at', 'desc')
      .firstOrFail()

    assert.equal(activity.action, 'comment_created')
    assert.equal(activity.commentId, comment!.id)

    const showResponse = await client.get(`/projects/${project.id}`).loginAs(viewer)

    showResponse.assertStatus(200)
    showResponse.assertTextIncludes('This looks ready to ship.')
    showResponse.assertTextIncludes('Added a comment')
  })

  test('prevents users without project access from commenting', async ({ client }) => {
    const owner = await createUser('owner@example.com')
    const otherUser = await createUser('other@example.com')
    const project = await createProjectFor(owner)

    const response = await client
      .post(`/projects/${project.id}/comments`)
      .loginAs(otherUser)
      .form({
        body: 'Unauthorized comment',
      })
      .redirects(0)

    response.assertStatus(404)
  })
})
