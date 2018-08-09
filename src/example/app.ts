import express = require('express')
import router from './router'

const app = express()

app.get('/test', (request: express.Request, response: express.Response) => {
  response.setHeader('content-type', 'application/json')
  response.send({ test: 'test' })
})

router(app)

export { app }
