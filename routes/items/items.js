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

router.get('/item', async (req, res) => {
  const query = require('url').parse(req.url, true).query
  const name = query.name
  const vehicle = query.vehicle

  if (name) {
    try {
      const items = await Item
                    .find({ name: { $regex: name, $options: 'i'}})
                    .select()
                    .sort()
      if (items.length === 0) {
        return res.status(400).send('No items found.')
      }

      return res.status(200).send(items)
    } catch(ex) {
      return res.status(404).send(ex)
    }
  }

  if (vehicle) {
    try {
      const items = await Item.find({ $text: { $search: vehicle}})

      if (items.length === 0) {
        return res.status(400).send('No items found')
      }

      return res.status(200).send(items)
    } catch (ex) {
      return res.status(404).send(ex)
    }
  }

  res.status(400).send('No items found.')
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

  const vehicles = []
  req.body.vehicles.forEach(vehicle => vehicles.push({ name: vehicle}))

  const item = new Item({
    name: req.body.name,
    vehicles: vehicles,
    any: req.body.any,
    costPrice: req.body.costPrice,
    salePrice: req.body.salePrice,
    supplier: req.body.supplier
  })

  const result = await item.save()
  res.status(200).send(result)
})

module.exports = router