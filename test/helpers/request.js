const { request } = require('./chai')
const app = require('../example/app')
module.exports = request(app).keepOpen()
