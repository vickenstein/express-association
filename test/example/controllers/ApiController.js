const { Controller } = require('dist/index')

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

module.exports = ApiController
