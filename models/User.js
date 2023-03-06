const { model, Schema } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  name: String,
  passwordHash: String,
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note' // Para hacer referencia al modelo Note
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString()
    delete returnObject.__v
    delete returnObject._id
    delete returnObject.passwordHash
  }
})

const User = model('User', userSchema)

userSchema.plugin(uniqueValidator)
module.exports = User
