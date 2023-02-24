require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

app.use(cors())
app.use(express.json())

const logger = require('./loggerMiddleward')

app.use(logger)

app.get('/', (req, res) => {
  res.send('<h1>Hello world </h1>')
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then(response => {
    res.json(response)
  }).catch(error => {
    console.log('error get', error)
    res.status(404).json({
      error: 'Not found'
    })
  })
})

app.get('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  Note.findById(id).then(note => {
    if (note) {
      res.json(note)
    } else {
      res.status(404).end()
    }
  }).catch(error => {
    next(error)
    res.status(400).end()
  })
})

app.put('/api/notes/:id', (req, res, next) => {
  // const id = req.params.id
  // const note = req.body
  // const newNoteInfo = new Note({
  //   content: note.content,
  //   important: note.important ? note.important : false
  // })
  // Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
  //   .then(updatedNote => {
  //     res.json(updatedNote)
  //   })
  //   .catch(error => next(error))
  const note = req.body
  const id = req.params.id

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(error => next(error))
})

app.post('/api/notes', (req, res) => {
  const note = req.body
  if (!note || !note.content) {
    res.status(404).json({
      error: 'Note content is missing'
    })
  } else {
    const newNote = new Note({
      content: note.content,
      date: new Date().toISOString(),
      important: note.important ? note.important : false
    })
    newNote.save().then(savedNote => {
      res.json(savedNote)
    }).catch(error => {
      console.log({ error })
    })
    res.status(201).json(newNote)
  }
})

app.delete('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  Note.findByIdAndRemove(id).then(noteRemoved => {
    if (noteRemoved) {
      res.json(noteRemoved)
    } else {
      res.status(404).end()
    }
  }).catch(error => {
    next(error)
    res.status(400).end()
  })
})

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log('Server running on port', PORT)
})
