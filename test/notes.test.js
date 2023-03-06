const { server } = require('../index')
const Note = require('../models/Note')
const { initialNotes, api, getAllContentFromNotes } = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})
  for (const note of initialNotes) {
    const noteObject = new Note(note)
    noteObject.save()
  }
})

test('notes are returned as json', async () => {
  await api.get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two notes', async () => {
  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(initialNotes.length)
})

test('the first note is about minudev', async () => {
  const response = await api.get('/api/notes')
  const contents = response.body.map(note => note.content)
  expect(contents).toContain('Aprendiendo FullStack')
})

test('a valid note can be added', async () => {
  const newNote = {
    content: 'Ya casi...',
    important: true,
    date: new Date()
  }
  await api.post('/api/notes').send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const { contents, response } = await getAllContentFromNotes()
  expect(contents).toContain(newNote.content)
  expect(response.body).toHaveLength(initialNotes.length + 1)
})

test('not without content is nos added', async () => {
  const newNote = {
    important: true,
    date: new Date()
  }
  await api.post('/api/notes').send(newNote)
    .expect(404)

  const response = await api.get('/api/notes')
  expect(response.body).toHaveLength(initialNotes.length)
})

afterAll(() => {
  server.close()
})

test('delete a note', async () => {
  const { response } = await getAllContentFromNotes()
  const noteToDelete = response.body[0]
  // await api.delete('/api/notes/434545')
  await api.delete(`/api/notes/${noteToDelete.id}`)
    .expect(200)
  const getDataAfterDelete = await getAllContentFromNotes()
  expect(getDataAfterDelete.response.body).toHaveLength(initialNotes.length - 1)
})

test('delete a note not existing', async () => {
  // const { response } = await getAllContentFromNotes()
  // const noteToDelete = response.body[response.body.length - 1]
  // await api.delete(`/api/notes/${noteToDelete.id}`)
  await api.delete('/api/notes/434545')
    .expect(400)
  const getDataAfterDelete = await getAllContentFromNotes()
  expect(getDataAfterDelete.response.body).toHaveLength(initialNotes.length)
})
