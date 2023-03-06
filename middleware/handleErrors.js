const ERROR_HANDLERS = {
  CastError: (res, error) => {
    res.status(400).send({ error: 'id used is malformed' })
  },
  ValidationError: (res, error) => {
    res.status(409).send({
      error: error.message
    })
  },
  JsonWebTokenError: (res, error) => {
    res.status(401).send({
      error: 'token missing or invalid'
    })
  },
  TokenExpirerError: (res, error) => {
    res.status(401).send({
      error: 'Expired token'
    })
  },
  DefaultError: (res, error) => {
    res.status(500).end()
  }
}

module.exports = (error, req, res, next) => {
  console.log('error.name 102', error.name)
  const handlerError = ERROR_HANDLERS(error.name || ERROR_HANDLERS.DefaultError)
  handlerError(res, error)
}
