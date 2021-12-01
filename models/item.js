const mongoose = require('mongoose')
const Joi = require('joi')

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  vehicles: {
    type: [{
      name: {
        type: String,
        required: true
      },
      model: {
        type: String,
        default: ' '
      }
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

const vehicleSchema = new Joi.object({
  name: Joi.string().trim().required(),
  model: Joi.string().default('')
})

const validateVehicle = (vehicle) => {
  return vehicleSchema.validate(vehicle)
}

const validateItem = (item) => {
  const schema = new Joi.object({
    name: Joi.string().trim().required(),
    vehicles: Joi.array().items(vehicleSchema).default([]),
    any: Joi.boolean().default(false),
    costPrice: Joi.number().required(),
    salePrice: Joi.number().required(),
    mrp: Joi.number().default(0),
    supplier: Joi.string().default("")
  })

  return schema.validate(item)
}

module.exports.Item = Item
module.exports.validateItem = validateItem
module.exports.validateVehicle = validateVehicle