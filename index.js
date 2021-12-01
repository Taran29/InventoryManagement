const mongoose = require('mongoose')
const express = require('express')
const dotenv = require('dotenv')

const handleUsers = require('./routes/users/handleUsers')
const login = require('./routes/users/login')
const changePassword = require('./routes/users/changePassword')

const items = require('./routes/items/items')

const inventory = require('./routes/inventory/inventory')

dotenv.config()

const app = express()
app.use(express.json())
app.use('/api/users', handleUsers)
app.use('/api/login', login)
app.use('/api/changePassword', changePassword)
app.use('/api/items', items)
app.use('/api/inventory', inventory)

mongoose.connect(process.env.DATABASE_URI)
  .then(() => {
    console.log("Connected to MongoDB...")
  }).catch((err) => {
    console.error(err)
  })

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})