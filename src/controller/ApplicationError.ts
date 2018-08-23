import * as ExtendableError from 'es6-error'

// @ts-ignore: ExtendableError miss match imported interface
export class ApplicationError extends ExtendableError {

  _log: string
  message: string
  stack: any
  ['constructor']: typeof ApplicationError
  static status: number

  constructor(message: any = 'There was an error', log?: any) {
    super(message)
    this._log = log
  }

  get type() {
    return this.constructor.name
  }

  get status() {
    return this.constructor.status || 500
  }

  get log() {
    return this._log || this.message
  }

}
