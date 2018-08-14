const { ApplicationError } = require('dist/index')

module.exports = class ResourceNotFoundError extends ApplicationError {

  static get status() {
    return 404
  }

}
