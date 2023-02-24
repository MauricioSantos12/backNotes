require('dotenv').config()
const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI
// conexion mongodb
mongoose.connect(connectionString, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
//   useFindAndModify: false,
//   useCreateIndex: true
}).then(() => {
  console.log('Database conected')
}).catch(error => {
  console.log({ error })
})
