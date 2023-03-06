require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const usersRouter = require('./controllers/users')
const notesRouter = require('./controllers/notes')
const router = express.Router()

Sentry.init({
  dsn: 'https://3e206eb9375b4473a163d2407333bac1@o4504736783663104.ingest.sentry.io/4504736784908288',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.use(cors())
app.use(express.json())
app.use('/images', express.static('images'))

const logger = require('./loggerMiddleward')

app.use(logger)

app.get('/', async (req, res) => {
  res.send('<h1>Hello world </h1>')
})

app.use('/api/notes', notesRouter)

app.use('/api/users', usersRouter)

app.use(notFound)
app.use(Sentry.Handlers.errorHandler())
app.use(handleErrors)

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
  console.log('Server running on port', PORT)
})

module.exports = { app, server, router }
