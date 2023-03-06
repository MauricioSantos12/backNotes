const { request } = require('express')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authorization = req.get('authorization')
  let token = null
  if (authorization && authorization.toLocaleLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }

  let decodedToken = {}

  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch (error) {
    return res.status(401).json({
      error: 'token missing or invlid'
    })
  }

  if (!token || !decodedToken.id) {
    return res.status(401).json({
      error: 'token missing or invlid'
    })
  }
  const { id: userId } = decodedToken
  request.userId = userId
  next()
}
