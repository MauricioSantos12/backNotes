const express = require('express')
const cors = require('cors')
const PORT = 3001
const app = express()

app.use(cors())
app.use(express.json())

let notes = [
  {
    id: 1,
    content: 'Aprendiendo API',
    date: '2019-05-30',
    important: true
  },
  {
    id: 2,
    content: 'Frontend',
    date: '2022-10-30',
    important: false
  },
  {
    id: 3,
    content: 'Express',
    date: '2023-12-07',
    important: true
  }
]
// const app = http.createServer((req, res) => {
//     res.writeHead(200, {'Content-type': 'application/json'})
//     res.end(JSON.stringify(notes))
// })

const logger = require('./loggerMiddleward')

app.use(logger)

app.get('/', (req, res) => {
  res.send('<h1>Hello world </h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)
  res.status(204).end()
})

app.post('/api/notes', (req, res) => {
  const note = req.body
  if (!note || !note.content) {
    res.status(404).json({
      error: 'Note content is missing'
    })
  } else {
    const ids = notes.map(note => note.id)
    const maxId = Math.max(...ids)
    const newNote = {
      id: maxId + 1,
      content: note.content,
      date: new Date().toISOString(),
      important: note.important ? note.important : false
    }
    notes.push(newNote)
    res.status(201).json(newNote)
  }
})

app.use((req, res) => {
  console.log(req.path)
  res.status(404).json({
    error: 'Not found'
  })
})

app.listen(PORT, () => {
  console.log('Server running on port', PORT)
})
