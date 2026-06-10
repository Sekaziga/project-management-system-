import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import User from '#models/user'
import Project from '#models/project'
import ProjectMember from '#models/project_member'
import Attachment from '#models/attachment'
import ActivityLog from '#models/activity_log'

test.group('Attachments', (group) => {
  group.each.setup(() => {
    return testUtils.db().truncate()
  })

  const testFileContents = 'attachment content'

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
      name: 'Attachment Project',
      description: 'Project for attachment tests',
      status: 'active',
    })
  }

  function createTestFile(contents = testFileContents) {
    const tmpDir = join(process.cwd(), 'tmp')
    if (!existsSync(tmpDir)) {
      mkdirSync(tmpDir, { recursive: true })
    }
    const filePath = join(tmpDir, 'test-upload.txt')
    writeFileSync(filePath, contents)
    return filePath
  }

  test('allows members to upload attachments and records activity', async ({ client, assert }) => {
    const owner = await createUser('owner@example.com')
    const member = await createUser('member@example.com')
    const project = await createProjectFor(owner)

    await ProjectMember.create({
      projectId: project.id,
      userId: member.id,
      role: 'member',
    })

    const filePath = createTestFile('attachment content')

    const response = await client
      .post(`/projects/${project.id}/attachments`)
      .loginAs(member)
      .file('file', filePath, 'test-upload.txt')
      .redirects(0)

    response.assertStatus(302)

    const attachment = await Attachment.query()
      .where('project_id', project.id)
      .firstOrFail()

    assert.equal(attachment.originalName, 'test-upload.txt')
    assert.equal(attachment.fileSize, Buffer.byteLength(testFileContents))
    assert.equal(attachment.userId, member.id)
    assert.isNull(attachment.taskId)

    const activity = await ActivityLog.query()
      .where('project_id', project.id)
      .orderBy('created_at', 'desc')
      .firstOrFail()

    assert.equal(activity.action, 'attachment_added')
    assert.equal(activity.actorId, member.id)
  })

  test('allows authorized users to download attachments', async ({ client, assert }) => {
    const owner = await createUser('owner@example.com')
    const viewer = await createUser('viewer@example.com')
    const project = await createProjectFor(owner)

    await ProjectMember.create({
      projectId: project.id,
      userId: viewer.id,
      role: 'viewer',
    })

    const uploadsDir = join(process.cwd(), 'tmp', 'uploads')
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true })
    }
    const fileContent = 'test file content'
    writeFileSync(join(uploadsDir, 'test-file.txt'), fileContent)

    const attachment = await Attachment.create({
      projectId: project.id,
      taskId: null,
      userId: owner.id,
      fileName: 'test-file.txt',
      originalName: 'test-file.txt',
      mimeType: 'text/plain',
      fileSize: Buffer.byteLength(fileContent),
    })

    const response = await client
      .get(`/projects/${project.id}/attachments/${attachment.id}/download`)
      .loginAs(viewer)
      .redirects(0)

    response.assertStatus(200)
    response.assertHeader('Content-Type', 'text/plain')
    response.assertHeader(
      'Content-Disposition',
      'attachment; filename="test-file.txt"'
    )
  })

  test('prevents unauthorized users from downloading attachments', async ({ client }) => {
    const owner = await createUser('owner@example.com')
    const otherUser = await createUser('other@example.com')
    const project = await createProjectFor(owner)

    const attachment = await Attachment.create({
      projectId: project.id,
      taskId: null,
      userId: owner.id,
      fileName: 'test-file.txt',
      originalName: 'test-file.txt',
      mimeType: 'text/plain',
      fileSize: 18,
    })

    const response = await client
      .get(`/projects/${project.id}/attachments/${attachment.id}/download`)
      .loginAs(otherUser)
      .redirects(0)

    response.assertStatus(404)
  })

  test('prevents unauthorized users from uploading attachments', async ({ client }) => {
    const owner = await createUser('owner@example.com')
    const otherUser = await createUser('other@example.com')
    const project = await createProjectFor(owner)

    const filePath = createTestFile('unauthorized upload')

    const response = await client
      .post(`/projects/${project.id}/attachments`)
      .loginAs(otherUser)
      .file('file', filePath, 'unauthorized.txt')
      .redirects(0)

    response.assertStatus(404)
  })

  test('allows admins to delete attachments', async ({ client, assert }) => {
    const owner = await createUser('owner@example.com')
    const admin = await createUser('admin@example.com')
    const project = await createProjectFor(owner)

    await ProjectMember.create({
      projectId: project.id,
      userId: admin.id,
      role: 'admin',
    })

    const attachment = await Attachment.create({
      projectId: project.id,
      taskId: null,
      userId: owner.id,
      fileName: 'to-delete.txt',
      originalName: 'to-delete.txt',
      mimeType: 'text/plain',
      fileSize: 10,
    })

    const response = await client
      .delete(`/projects/${project.id}/attachments/${attachment.id}`)
      .loginAs(admin)
      .redirects(0)

    response.assertStatus(302)

    const deleted = await Attachment.find(attachment.id)
    assert.isNull(deleted)
  })

  test('validates file type', async ({ client, assert }) => {
    const owner = await createUser('owner@example.com')
    const project = await createProjectFor(owner)

    const filePath = createTestFile('<?php echo "hello"; ?>')

    const response = await client
      .post(`/projects/${project.id}/attachments`)
      .loginAs(owner)
      .file('file', filePath, 'malicious.php')
      .redirects(0)

    response.assertStatus(302)

    const attachmentCount = await Attachment.query()
      .where('project_id', project.id)
      .count('* as total')
      .first()

    assert.equal(Number(attachmentCount?.$extras?.total ?? 0), 0)
  })

  test('validates file is required', async ({ client, assert }) => {
    const owner = await createUser('owner@example.com')
    const project = await createProjectFor(owner)

    const response = await client
      .post(`/projects/${project.id}/attachments`)
      .loginAs(owner)
      .form({})
      .redirects(0)

    response.assertStatus(302)

    const attachmentCount = await Attachment.query()
      .where('project_id', project.id)
      .count('* as total')
      .first()

    assert.equal(Number(attachmentCount?.$extras?.total ?? 0), 0)
  })
})
