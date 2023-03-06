const usersRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (req, res) => {
  try {
    const users = await User.find({}).populate('notes',{
      content: 1, important: 1, date: 1
    })
    res.status(200).json(users)
  } catch (error) {
    res.status(400).json(error)
  }
})

usersRouter.post('/', async (req, res) => {
  try {
    const { body } = req
    const { username, name, passwordHash } = body

    const saltRounds = 10
    const passwordHashFinal = await bcrypt.hash(passwordHash, saltRounds)
    const newUser = new User({
      username,
      name,
      passwordHash: passwordHashFinal,
      notes: []
    })
    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (error) {
    res.status(400).json(error)
  }
})

module.exports = usersRouter
