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

  async asyncError() {
    throw new ResourceNotFoundError
  }

  fine() {
    this.send({
      test: 'test'
    })
  }

  async errorBeforeFine() {
    throw new ResourceNotFoundError
  }

  errorAfterNotFine() {
    if (this.error instanceof ResourceNotFoundError) {
      this.send({
        test: 'test'
      })
    } else {
      throw this.error
    }
  }

  notFine() {
    throw new ResourceNotFoundError
  }
}

UserPurchase.before('errorBeforeFine', {
  only: ['fine']
})

UserPurchase.after('errorAfterNotFine', {
  only: ['notFine']
})

UserPurchase.error(ResourceNotFoundError, {
  only: ['error', 'asyncError', 'fine']
})

UserPurchase.parameter('multi', [Joi.string(), Joi.number()])

UserPurchase.parameter('test', Joi.any().forbidden())

module.exports = {
  UserPurchase
}
