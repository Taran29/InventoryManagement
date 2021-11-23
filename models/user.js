const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Joi = require('joi')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  }, 
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Employee'],
    default: 'Employee'
  },
})

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign( { 
    _id: this._id,
    role: this.role  
  }, process.env.JWT_PRIVATE_KEY)
  return token
}

const User = mongoose.model('user', userSchema)

const validateUser = (user) => {
  const schema = new Joi.object({
    name: Joi.string().required().trim().max(50),
    email: Joi.string().email().required().trim().max(255),
    password: Joi.string().min(8).max(24).required(),
    role: Joi.string().valid('Admin', 'Employee').default('Employee')
  })

  return schema.validate(user)
}

module.exports.User = User
module.exports.validateUser = validateUser