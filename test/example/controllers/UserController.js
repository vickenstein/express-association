const Joi = require('joi')
const ApiController = require('./ApiController')

class UserController extends ApiController {

  index() {
    this.send({
      index: 'index'
    })
  }

  show() {
    this.send({
      show: this.parameters.userId
    })
  }

  create() {
    this.send({
      create: this.parameters.test
    })
  }

  update() {
    this.send({
      update: this.parameters.test
    })
  }

  delete() {
    this.send({
      delete: this.parameters.userId
    })
  }

  sub() {
    this.send({
      test: this.parameters.test || this.parameters.userId
    })
  }

  token() {
    this.setHeader('token', 'user')
  }

}

UserController.before('token')

UserController.parameter('test', Joi.string().required(), { only: ['create', 'update'] })

module.exports = UserController
