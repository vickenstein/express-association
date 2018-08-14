const Joi = require('joi')
const ApiController = require('./ApiController')
const ResourceNotFoundError = require('../errors/ResourceNotFoundError')

class UserPurchase extends ApiController {

  index() {
    this.send({
      index: this.parameters.userId
    })
  }

  show() {
    this.send({
      show: this.parameters.userPurchaseId
    })
  }

  error() {
    throw new ResourceNotFoundError
  }

}

UserPurchase.error(ResourceNotFoundError, {
  only: ['error']
})

UserPurchase.parameter('test', Joi.any().forbidden())

module.exports = {
  UserPurchase
}
