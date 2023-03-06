const { server } = require('../index')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const saltRounds = 2
const { api, getUsers } = require('./helpers')

describe('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = 'probePass'
    const passwordHashFinal = await bcrypt.hash(passwordHash, saltRounds)
    const user = new User({ username: 'MauroDev', name: 'Mauro', passwordHash: passwordHashFinal })
    await user.save()
  })

  test('works as expected creating a fresh username', async () => {
    const userAtStart = await getUsers()
    const newUser = {
      username: 'Maria',
      name: 'Maria',
      passwordHash: 'Mar1a'
    }

    await api.post('/api/users').send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(userAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fais with proper statuscode and message if username is already taken', async () => {
    const newUser = {
      username: 'Maria',
      name: 'Maria',
      passwordHash: 'Mar1a'
    }

    await api.post('/api/users').send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtStart = await getUsers()
    const result = await api.post('/api/users').send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.errors.username.message).toContain('`username` to be unique')
    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  afterAll(() => {
    server.close()
  })
})
