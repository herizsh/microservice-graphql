const express = require('express')
const assert = require('assert')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
const routes = require('./routes')
const app = express()
const port = 3001

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const url = 'mongodb://localhost:27017'
const dbName = 'entertain-me'
const client = new MongoClient(url, { useUnifiedTopology: true })

client.connect(function(err) {
  assert.equal(null, err)
  const db = client.db(dbName)
  app.use((req, res, next) => {
    req.db = db
    next()
  })
  app.use(routes)
  app.use((err, req, res, next) => {
    res.send(err)
  })
})

app.listen(port, () => console.log(`App listening on port ${port}!`))
