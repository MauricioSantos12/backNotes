const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')

loginRouter.post('/', async (req, res) => {
  try {
    const { body } = req
    const { username, password } = body
    const user = await User.findOne({ username })
    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)
    if (!(user && passwordCorrect)) {
      res.status(401).json({
        error: 'Invalid user or password'
      })
    }
    const userForToken = {
      id: user._id,
      username: user.username
    }

    const token = jwt.sign(userForToken, process.env.SECRET,
      {
        expiresIn: 60 * 60 * 24 * 7
      })
    res.send({
      username: user.username,
      name: user.name,
      token
    })
  } catch (error) {
    console.log({ error })
  }
})

module.exports = loginRouter
