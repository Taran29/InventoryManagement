const mongoose = require('mongoose')
const Joi = require('joi')

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  vehicles: {
    _id: false,
    type: [{
      name: String
    }],
    default: [],
  },
  any: {
    type: Boolean,
    default: false
  }, 
  costPrice: {
    type: Number,
    required: true
  },
  salePrice: {
    type: Number,
    required: true
  },
  mrp: {
    type: Number,
    default: 0
  },
  supplier: {
    type: String,
    default: ""
  }
})

const Item = mongoose.model('item', itemSchema)

const validateItem = (item) => {
  const schema = new Joi.object({
    name: Joi.string().trim().required(),
    vehicles: Joi.array().items(Joi.string()).default([]),
    any: Joi.boolean().default(false),
    costPrice: Joi.number().required(),
    salePrice: Joi.number().required(),
    mrp: Joi.number(),
    supplier: Joi.string().default("")
  })

  return schema.validate(item)
}

module.exports.Item = Item
module.exports.validateItem = validateItem