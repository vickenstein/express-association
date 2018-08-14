import { ApplicationError } from './ApplicationError'

export class ParameterValidationError extends ApplicationError {

  static get status() {
    return 422
  }

}
