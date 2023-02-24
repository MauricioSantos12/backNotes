const mongoose = require('mongoose')
const { model, Schema } = mongoose

const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean
})

noteSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString()
    delete returnObject.__v
    delete returnObject._id
  }
})

const Note = model('Note', noteSchema)

module.exports = Note

// const note = new Note({
//   content: 'MongoDB connected',
//   date: new Date(),
//   important: true
// })

// note.save().then(result => {
//   console.log('result', result)
//   mongoose.connection.close()
// }).catch((error) => {
//   console.log('error', error)
// })

// Note.find({}).then(results => {
//   console.log({ results })
//   mongoose.connection.close()
// }).catch(error => {
//   console.log({ error })
// })
