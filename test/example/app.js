const express = require('express')
const router = require('./router')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())

app.get('/test', (request, response) => {
  response.send({ test: 'test' })
})

router.launchOn(app)

module.exports = app
