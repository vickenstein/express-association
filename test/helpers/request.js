const { request } = require('./chai')
const app = require('test/example/app')
module.exports = request(app).keepOpen()
