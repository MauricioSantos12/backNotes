const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')
notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({}).populate('user', {
    username: 1, name: 1
  })
  res.json(notes)
})

notesRouter.get('/:id', (req, res, next) => {
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

notesRouter.put('/:id', (req, res, next) => {
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

notesRouter.post('/', async (req, res, next) => {
  const {content, important = false, userId} = req.body
  const user = await User.findById(userId)
  if (!content || !content) {
    res.status(404).json({
      error: 'Note content is missing'
    })
  } else {
    const newNote = new Note({
      content,
      date: new Date().toISOString(),
      important: important ? important : false,
      user: user._id
    })
    try {
      const savedNote = await newNote.save() // save note in db
      user.notes = user.notes.concat(savedNote._id) // add nonte to user
      await user.save() // save user with notes
      res.status(201).json(savedNote)
    } catch (error) {
      next(error)
    }
  }
})

notesRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    await Note.findByIdAndRemove(id)
    res.status(200).end()
  } catch (error) {
    res.status(400).end()
  }
})

module.exports = notesRouter
