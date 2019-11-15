const Joi = require('@hapi/joi')
const { Controller } = require('../../../dist/index')
const RandomError = require('../errors/RandomError')

class ApiController extends Controller {

  test() {
    this.setHeader('test', '1337')
  }

  async asyncTest() {
    this.setHeader('asyncTest', 1337)
  }

  index() {
    this.send({
      test: 'test'
    })
  }

  about() {
    this.send({
      about: 'about'
    })
  }

}

ApiController.before('test')

ApiController.before('asyncTest', { except: ['about'] })

ApiController.before(function token() {
  this.setHeader('token', '1337')
}, { only: ['index'] })

ApiController.parameter('test', Joi.string())

ApiController.parameter('number', Joi.number(), { only: 'about' })

ApiController.error(RandomError)

module.exports = ApiController
