const express = require('express')
const { Inventory } = require('../../models/inventory')
const { Item } = require('../../models/item')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find().populate('itemId', 'name salePrice')
    res.status(200).send(inventory)
  } catch (ex) {
    res.status(404).send(ex)
  }
})

router.post('/', async (req, res) => {
  const item = await Item.findById(req.body.itemId)
  if (!item) return res.status(400).send('No item found.')

  const entry = new Inventory({
    itemId: req.body.itemId,
    numberInStock: req.body.numberInStock
  })

  try {
    const result = await entry.save()
    res.status(200).send(result)
  } catch (ex) {
    res.status(404).send(ex)
  }
})

router.put('/:id', async (req, res) => {
  try {
    const result = await Item.findOneAndUpdate({ itemId: req.params.id}, {
      $set: {
        numberInStock: req.body.numberInStock
      }
    }, { new: true})

    res.status(200).send(result)
  } catch (ex) {
    res.status(400).send(ex)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const result = await Item.findOneAndDelete({ itemId: req.params.id})
    if (!result) return res.status(400).send('No item found.')

    res.status(200).send(result)
  } catch (ex) {
    res.status(400).send(ex)
  }
})

module.exports = router