const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const app = express()
const port = 3000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(routes)
app.use((err, req, res, next) => {
  res.send(err)
})

app.listen(port, () => console.log(`App listening on port ${port}!`))
