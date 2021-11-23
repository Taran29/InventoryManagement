const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const { User } = require('../models/user')

const router = express.Router()

router.post('/', async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return res.status(400).send('User does not exist.')
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) {
    return res.status(400).send('Incorrect Password')
  }

  const result = _.pick(user, ['_id', 'name', 'email', 'role'])
  const token = user.generateAuthToken()

  res.status(200).header('x-auth-token', token).send(result)
})

module.exports = router