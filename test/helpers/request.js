const { request } = require('./chai')
const { app } = require('dist/example/app')
module.exports = request(app)
