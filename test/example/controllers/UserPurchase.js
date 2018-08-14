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

module.exports = {
  UserPurchase
}
