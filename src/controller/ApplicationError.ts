import * as ExtendableError from 'es6-error'

// @ts-ignore: ExtendableError miss match imported interface
export class ApplicationError extends ExtendableError {

  _log: string
  message: string
  ['constructor']: typeof ApplicationError
  static status: number

  constructor(message: string = 'There was an error', log?: string) {
    super(message)
    this._log = log
  }

  get status() {
    return this.constructor.status || 500
  }

  get log() {
    return this._log || this.message
  }

}
