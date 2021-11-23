const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const { User, validateUser } = require('../models/user')
const authAdmin = require('../middlewares/authAdmin')

const router = express.Router()

router.post('/', authAdmin, async (req, res) => {
  const { error } = validateUser(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  const salt = bcrypt.genSalt(10)
  const hashed = bcrypt.hash(req.body.password, salt)

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashed,
    role: req.body.role
  })

  const token = user.generateAuthToken()
  const result = user.save()

  const response = _.pick(result, ['_id', 'name', 'email', 'role'])
  res.status(200).header('x-auth-token', token).send(response)
})

module.exports = router