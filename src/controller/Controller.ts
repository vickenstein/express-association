import * as express from 'express'
import * as _ from 'lodash'
import { ApplicationError } from './ApplicationError'
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

  error: any
  controller: string
  action: string
  request: express.Request
  response: express.Response
  static beforeMiddlewares: any
  static afterMiddlewares: any
  static __proto__: any
  [action: string]: any

  constructor(request: express.Request, response: express.Response) {
    this.request = request
    this.response = response
  }

  errorHandler(error: ApplicationError) {

    console.log({
      type: error.constructor.name,
      log: error.log,
      status: error.status
    })

// @ts-ignore: method intended for controller instance
    this.status(error.status)

// @ts-ignore: method intended for controller instance
    this.send({
      type: error.constructor.name,
      message: error.message,
      status: error.status
    })

  }

  static before(middleware: any, options: IMiddlewareOption = {}) {
    if (!this.beforeMiddlewares) this.beforeMiddlewares = []
    this.beforeMiddlewares = this.beforeMiddlewares.concat([[middleware, options]])
  }

  static after(middleware: any, options: IMiddlewareOption = {}) {
    if (!this.afterMiddlewares) this.afterMiddlewares = {}
    if (!this.afterMiddlewares[this.name]) this.afterMiddlewares[this.name] = []
    this.afterMiddlewares[this.name].push([middleware, options])
  }

  static constructorMiddleware(action: string) {
    return (request: express.Request, response: express.Response, next: express.NextFunction) => {
      request.controller = new this(request, response)
      request.controller.controller = this.name.match(/(\w+)(Controller)?/)[1]
      request.controller.action = action
      next()
    }
  }

  static error() {

  }

  static inheritedProperties(key: string) {
// @ts-ignore: method intended for controller instance
    let inheritedProperties: any[] = this[key] || []
    let proto = this.__proto__
    while (proto[key]) {
      inheritedProperties = proto[key].concat(inheritedProperties)
      proto = proto.__proto__
    }
    return inheritedProperties
  }

  static get inheritedBeforeMiddlewares(): any[] {
    return this.inheritedProperties('beforeMiddlewares')
  }

  static get inheritedAfterMiddlewares(): any[] {
    return this.inheritedProperties('afterMiddlewares')
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

  static generateErrorHandlerMiddleware(action: string) {
    return (error: any, request: express.Request, response: express.Response, next: express.NextFunction) => {
      request.controller.errorHandler(error)
      next()
    }
  }

  static filter(list: any[] = [], action: string) {
    return list.filter(([middleware, options]) => {
      if (options.only) return _.includes(options.only, action)
      if (options.except) return !_.includes(options.except, action)
      return true
    })
  }

  static generateBeforeMiddleware(middleware: any) {
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

  static generateBeforeMiddlewares(middlewares: any[]) {
    return middlewares.map(([middleware, options]) => {
      return this.generateBeforeMiddleware(middleware)
    })
  }

  static generateAfterMiddleware(middleware: any) {
    if (typeof middleware === 'string') middleware = this.prototype[middleware]
    if (!middleware.length) {
      if (middleware.constructor.name === 'AsyncFunction') {
        return (error: any, request: express.Request, response: express.Response, next: express.NextFunction) => {
          if (!error) return next()
          middleware.bind(request.controller)().then(next).catch(next)
        }
      }
      return (error: any, request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (!error) return next()
        request.controller.error = error
        middleware.bind(request.controller)()
        next()
      }
    }
  }

  static generateAfterMiddlewares(middlewares: any[]) {
    return middlewares.map(([middleware, options]) => {
      return this.generateAfterMiddleware(middleware)
    })
  }

  static middlewares(action: string) {

    const beforeMiddlewares = this.filter(this.inheritedBeforeMiddlewares, action)
    const afterMiddlewares = this.filter(this.inheritedAfterMiddlewares, action)

    return [
      this.constructorMiddleware(action),
      ...this.generateBeforeMiddlewares(beforeMiddlewares),
      this.generateActionMiddleware(action),
      ...this.generateAfterMiddlewares(afterMiddlewares),
      this.generateErrorHandlerMiddleware(action)
    ]
  }

  status(code: number) {
    this.response.status(code)
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
