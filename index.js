const mongoose = require('mongoose')
const express = require('express')
const dotenv = require('dotenv')

const handleUsers = require('./routes/handleUsers')
const login = require('./routes/login')
const changePassword = require('./routes/changePassword')

dotenv.config()

const app = express()
app.use(express.json())
app.use('/api/users', handleUsers)
app.use('/api/login', login)
app.use('/api/changePassword', changePassword)

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