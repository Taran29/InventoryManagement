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
  const model = query.model

  const searchQuery = {
    ...name != null && {name: { $regex: name, $options: 'i'}},
    ...vehicle != null && {$text: { $search: vehicle}}
  }

  let items = [], vehicleSearch = ''
  if (!vehicle) vehicleSearch = 'vehicles'

  try {
    items = await Item
                .find(searchQuery)
                .select({...vehicle != null && {vehicles: {$elemMatch: {name: { $regex: vehicle, $options: 'i'}}}}})
                .select(vehicleSearch)
                .select('name costPrice salePrice mrp supplier')
                .sort()
  } catch (ex) {
    return res.status(404).send(ex)
  }

  if (items.length === 0) return res.status(400).send('No items found.')

  if (vehicle && model) {
    let filteredItems = []

    items.forEach((item) => {
      if (item.vehicles[0].model.includes(model)) {
        filteredItems.push(item)
      }
    })

    if (filteredItems.length === 0) {
      return res.status(400).send('No items found.')
    }

    return res.status(200).send(filteredItems)
  }

  res.status(200).send(items)
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
    mrp: req.body.mrp,
    supplier: req.body.supplier
  })

  const result = await item.save()
  res.status(200).send(result)
})

router.delete('/:id', async (req, res) => {
  try {
    const result = await Item.findByIdAndDelete(req.params.id)
    if (!result) {
      return res.status(400).send('No item found.')
    } 

    return res.status(200).send(result)
  } catch (ex) {
    return res.status(404).send(ex)
  }
})

module.exports = router