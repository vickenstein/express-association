import { ApplicationError } from './ApplicationError'

export class UncaughtError extends ApplicationError {

  stack: any

  constructor(message:string = 'There was an error', log: string, stack: any) {
    super(message, log)
    this.stack = stack
  }

  static get status() {
    return 500
  }

}
