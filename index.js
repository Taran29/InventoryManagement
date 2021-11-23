const mongoose = require('mongoose')
const express = require('express')
const dotenv = require('dotenv')

const handleUsers = require('./routes/handleUsers')

dotenv.config()

const app = express()
app.use(express.json())
app.use('/api/users', handleUsers)

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