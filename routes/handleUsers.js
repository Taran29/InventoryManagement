const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const Joi = require('joi')

const { User, validateUser } = require('../models/user')
const authAdmin = require('../middlewares/authAdmin')
const auth = require('../middlewares/auth')

const router = express.Router()

router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).send({
      users: users
    })
  } catch (ex) {
    res.status(404).send(ex)
  }
})

router.get('/:id', auth, async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    return res.status(400).send('User does not exist.')
  }

  const result = _.pick(user, ['_id', 'name', 'email', 'role'])
  res.status(200).send(result)
})

router.post('/', authAdmin, async (req, res) => {
  const { error } = validateUser(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(req.body.password, salt)

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashed,
    role: req.body.role
  })

  const result = await user.save()

  const response = _.pick(result, ['_id', 'name', 'email', 'role'])
  res.status(200).send(response)
})

router.put('/:id', authAdmin, async (req, res) => {

  const schema = new Joi.object({
    name: Joi.string().max(50).trim(),
    role: Joi.string().valid('Admin', 'Employee')
  })

  const { error } = schema.validate(req.body)

  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  try { 
    const user = await User.findOneAndUpdate({ _id: req.params.id }, {
      $set: {
        name: req.body.name,
        role: req.body.role
      }
    }, { new: true })

    if (!user) {
      return res.status(400).send('User does not exist.')
    }

    res.status(200).send(user)
  } catch (ex) {
    return res.status(400).send('User does not exist')
  }
})

router.delete('/:id', authAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(400).send('User does not exist.')
    }
    res.status(200).send(_.pick(user, ['_id', 'name', 'email', 'role']))
  } catch (ex) {
    return res.status(400).send(ex)
  }
})

module.exports = router