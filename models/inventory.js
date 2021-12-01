const mongoose = require('mongoose')

const inventorySchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'item',
    required: true,
  },
  numberInStock: {
    type: Number,
    default: 0
  }
})

const Inventory = mongoose.model('inventory', inventorySchema)

module.exports.Inventory = Inventory