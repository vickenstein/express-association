const { ApplicationError } = require('dist/index')

module.exports = class RandomError extends ApplicationError {

  constructor(message = 'A Random Error', log = 'A Random Error') {
    super(message, log)
  }

  static get status() {
    return 500
  }

}
