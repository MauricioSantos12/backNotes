const mongoose = require('mongoose')
const { model, Schema } = mongoose

const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User' // Para hacer referencia al modelo Note
  }
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
