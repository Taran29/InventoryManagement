const express = require('express')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const { User } = require('../../models/user')
const authAdmin = require('../../middlewares/authAdmin')

const router = express.Router()

router.post('/', authAdmin, async(req, res) => {
  const schema = new Joi.object({
    password: Joi.string().min(8).max(24).required()
  })

  const { error } = schema.validate(req.body)

  if (error) {
    res.status(400).send(error.details[0].message)
  }

  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(req.body.password, salt)

  try {
    const user = await User.findOneAndUpdate({ _id: req.body.id }, {
      $set: {
        password: hashed
      }
    }, { new: true })
    
    if (!user) {
      return res.status(400).send('User does not exist')
    }

    res.status(200).send('Password has been updated')
  } catch (ex) {
    return res.status(404).send(ex)
  }
})

module.exports = router