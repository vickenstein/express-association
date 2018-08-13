import * as express from 'express'
import * as _ from 'lodash'

declare module 'express' {

  export interface Request {
    controller: Controller
  }

}

export interface IMiddlewareOption {
  only?: string[]
  except?: string[]
}

export class Controller {

  request: express.Request
  response: express.Response
  static _beforeMiddlewares: any
  static _afterMiddlewares: any
  static __proto__: any
  [action: string]: any

  constructor(request: express.Request, response: express.Response) {
    this.request = request
    this.response = response
  }

  static before(middleware: any, options: IMiddlewareOption = {}) {
    if (!this._beforeMiddlewares) this._beforeMiddlewares = {}
    if (!this._beforeMiddlewares[this.name]) this._beforeMiddlewares[this.name] = []
    this._beforeMiddlewares[this.name].push([middleware, options])
  }

  static after(middleware: any, options: IMiddlewareOption = {}) {
    if (!this._afterMiddlewares) this._afterMiddlewares = {}
    if (!this._afterMiddlewares[this.name]) this._afterMiddlewares[this.name] = []
    this._afterMiddlewares[this.name].push([middleware, options])
  }

  static get constructorMiddleware() {
    return (request: express.Request, response: express.Response, next: express.NextFunction) => {
      request.controller = new this(request, response)
      next()
    }
  }

  static get beforeMiddlewares(): any[] {
    const parentMiddleware = this.__proto__.beforeMiddlewares || []
    const localMiddleware = (this._beforeMiddlewares && this._beforeMiddlewares[this.name]) || []
    return [...parentMiddleware, ...localMiddleware]
  }

  static get afterMiddlewares(): any[] {
    const parentMiddleware = this.__proto__.afterMiddlewares || []
    const localMiddleware = (this._afterMiddlewares && this._afterMiddlewares[this.name]) || []
    return [...parentMiddleware, ...localMiddleware]
  }

  static generateExpressMiddleware(middleware: any) {
    if (typeof middleware === 'string') middleware = this.prototype[middleware]
    if (!middleware.length) {
      if (middleware.constructor.name === 'AsyncFunction') {
        return (request: express.Request, response: express.Response, next: express.NextFunction) => {
          middleware.bind(request.controller)().then(next).catch(next)
        }
      }
      return (request: express.Request, response: express.Response, next: express.NextFunction) => {
        middleware.bind(request.controller)()
        next()
      }
    }
    return middleware
  }

  static generateActionMiddleware(action: string) {
    const middleware = this.prototype[action]
    if (middleware.constructor.name === 'AsyncFunction') {
      return (request: express.Request, response: express.Response) => {
        middleware.bind(request.controller)().catch((error: any) => {
          throw error
        })
      }
    }
    return (request: express.Request, response: express.Response) => {
      middleware.bind(request.controller)()
    }
  }

  static filter(list: any[] = [], action: string) {
    return list.filter(([middleware, options]) => {
      if (options.only) return _.includes(options.only, action)
      if (options.except) return !_.includes(options.except, action)
      return true
    })
  }

  static generateExpressMiddlewares(middlewares: any[]) {
    return middlewares.map(([middleware, options]) => {
      return this.generateExpressMiddleware(middleware)
    })
  }

  static middlewares(action: string) {

    const beforeMiddlewares = this.filter(this.beforeMiddlewares, action)
    const afterMiddlewares = this.filter(this.afterMiddlewares, action)

    return [
      this.constructorMiddleware,
      ...this.generateExpressMiddlewares(beforeMiddlewares),
      this.generateActionMiddleware(action),
      ...this.generateExpressMiddlewares(afterMiddlewares)
    ]
  }

  setHeader(name: string, value: string | number | string[]) {
    this.response.setHeader(name, value)
  }

  json(body?: any) {
    this.response.json(body)
  }

  send(body?: any) {
    this.response.send(body)
  }

  get query() {
    return this.request.query
  }

  get params() {
    return this.request.params
  }

  get body() {
    return this.request.body
  }

  get parameters() {
    if (!this._parameters) {
      this._parameters = _.merge({}, this.query, this.params, this.body)
    }
    return this._parameters
  }
}
