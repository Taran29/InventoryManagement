const express = require('express')
const auth = require('../../middlewares/auth')
const { Item, validateItem } = require('../../models/item')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort('name 1')
    res.status(200).send({ items: items })
  } catch (ex) {
    res.status(404).send(ex)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
    if (!item) { 
      return res.status(400).send('Item with given ID does not exist')
    }
    
    res.status(200).send({ item: item })
  } catch (ex) {
    res.status(400).send(ex)
  }
})

router.post('/', async (req, res) => {
  const { error } = validateItem(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  const item = new Item({
    name: req.body.name,
    vehicles: req.body.vehicles,
    any: req.body.any,
    costPrice: req.body.costPrice,
    salePrice: req.body.salePrice,
    supplier: req.body.supplier
  })

  const result = await item.save()
  res.status(200).send(result)
})

module.exports = router