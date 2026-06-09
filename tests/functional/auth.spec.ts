import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import User from '#models/user'

test.group('Authentication', (group) => {
  group.each.setup(() => {
    return testUtils.db().truncate()
  })

  test('signs up a user and redirects to dashboard', async ({ client, assert }) => {
    const response = await client
      .post('/signup')
      .form({
        fullName: 'New User',
        email: 'new-user@example.com',
        password: 'password123',
        passwordConfirmation: 'password123',
      })
      .redirects(0)

    response.assertStatus(302)
    assert.equal(response.header('location'), '/dashboard')

    const user = await User.findBy('email', 'new-user@example.com')
    assert.isNotNull(user)
  })

  test('logs in a user and redirects to dashboard', async ({ client, assert }) => {
    const user = await User.create({
      fullName: 'Existing User',
      email: 'existing-user@example.com',
      password: 'password123',
    })

    const response = await client
      .post('/login')
      .form({
        email: user.email,
        password: 'password123',
      })
      .redirects(0)

    response.assertStatus(302)
    assert.equal(response.header('location'), '/dashboard')
  })
})
