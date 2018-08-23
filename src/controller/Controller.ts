import * as Joi from 'joi'
import * as express from 'express'
import * as _ from 'lodash'
import { ApplicationError } from './ApplicationError'
import { ParameterValidationError } from './ParameterValidationError'
import { UncaughtError } from './UncaughtError'
declare module 'express' {

  export interface Request {
    controller: Controller
  }

}

export interface IFilterableOption {
  only?: string[]
  except?: string[]
}

export class Controller {

  error: any
  controller: string
  action: string
  request: express.Request
  response: express.Response
  _parameters: any
  _nonUrlParameters: any[]
  static beforeMiddlewares: any
  static afterMiddlewares: any
  static errors: any
  static parameters: any
  static __proto__: any
  [action: string]: any

  constructor(request: express.Request, response: express.Response) {
    this.request = request
    this.response = response
  }

  errorHandler(error: ApplicationError) {

    console.log(error.stack)

    console.log({
      type: error.type,
      log: error.log,
      status: error.status
    })

// @ts-ignore: method intended for controller instance
    this.status(error.status)

// @ts-ignore: method intended for controller instance
    this.send({
      type: error.type,
      message: error.message,
      status: error.status
    })

  }

  static parameterValidationFunction(parameters: any[]) {

    const JoiSchema: any = {}

    parameters.forEach(([[key, validator], options]) => {
      JoiSchema[key] = validator
    })

    const schema = Joi.object(JoiSchema)

    return (parameters: any) => {
      const result = schema.validate(parameters)
      if (result.error) throw new ParameterValidationError(result.error.details, result.error.message)
    }
  }

  static before(middleware: any, options: IFilterableOption = {}) {
    if (!this.beforeMiddlewares) this.beforeMiddlewares = {}
    if (!this.beforeMiddlewares[this.name]) this.beforeMiddlewares[this.name] = []
    this.beforeMiddlewares[this.name].push([middleware, options])
  }

  static after(middleware: any, options: IFilterableOption = {}) {
    if (!this.afterMiddlewares) this.afterMiddlewares = {}
    if (!this.afterMiddlewares[this.name]) this.afterMiddlewares[this.name] = []
    this.afterMiddlewares[this.name].push([middleware, options])
  }

  static error(errorClass: any, options: IFilterableOption = {}) {
    if (!this.errors) this.errors = {}
    if (!this.errors[this.name]) this.errors[this.name] = []
    this.errors[this.name].push([errorClass, options])
  }

  static parameter(key: string, validator: any, options: IFilterableOption = {}) {
    if (!this.parameters) this.parameters = {}
    if (!this.parameters[this.name]) this.parameters[this.name] = []
    this.parameters[this.name].push([[key, validator], options])
  }

  static inheritedProperties(key: string) {
// @ts-ignore: method intended for controller instance
    let inheritedProperties: any[] = (this[key] && this[key][this.name]) || []
    let proto = this.__proto__
    while (proto) {
      inheritedProperties = ((proto[key] && proto[key][proto.name]) || []).concat(inheritedProperties)
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

  static get inheritedErrors(): any[] {
    return this.inheritedProperties('errors')
  }

  static get inheritedParameters(): any[] {
    return this.inheritedProperties('parameters')
  }

  static constructorMiddleware(action: string) {
    return (request: express.Request, response: express.Response, next: express.NextFunction) => {
      request.controller = new this(request, response)
      request.controller.controller = this.name.match(/(\w+)(Controller)?/)[1]
      request.controller.action = action
      response.locals = request.controller
      next()
    }
  }

  static generateActionMiddleware(action: string) {
    const middleware = this.prototype[action]
    if (middleware.constructor.name === 'AsyncFunction') {
      return (request: express.Request, response: express.Response, next: express.NextFunction) => {
        middleware.bind(request.controller)().catch(next)
      }
    }
    return (request: express.Request, response: express.Response) => {
      middleware.bind(request.controller)()
    }
  }

  static generateErrorHandlerMiddleware(errors: any[]) {
    return (error: any, request: express.Request, response: express.Response, next: express.NextFunction) => {
      if (_.includes(errors, error.constructor)) {
        return request.controller.errorHandler(error)
      } else {
        return request.controller.errorHandler(new UncaughtError(undefined, error.message, error.stack))
      }
      next(error)
    }
  }

  static filter(list: any[] = [], action: string) {
    return list.filter(([thing, options]) => {
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
          request.controller.error = error
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

  static generateParameterValidationMiddlewares(parameters: any[]) {
    const parameterValidationFunction = this.parameterValidationFunction(parameters)

    return (request: express.Request, response: express.Response, next: express.NextFunction) => {
      parameterValidationFunction(request.controller.nonUrlParameters)
      next()
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
    const errors = this.filter(this.inheritedErrors, action).map(([error, options]) => error)
    const parameters = this.filter(this.inheritedParameters, action)
    return [
      this.constructorMiddleware(action),
      this.generateParameterValidationMiddlewares(parameters),
      ...this.generateBeforeMiddlewares(beforeMiddlewares),
      this.generateActionMiddleware(action),
      ...this.generateAfterMiddlewares(afterMiddlewares),
      this.generateErrorHandlerMiddleware(errors)
    ]
  }

  //response

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

  redirect(status: number, url: string) {
    this.response.redirect(status, url)
  }

  render(view: string, options?: Object, callback?: (error: Error, html: string) => void) {
    this.response.render(view, options, callback)
  }

  //request

  get(field: string) {
    return this.request.get(field)
  }

  get ip() {
    return this.request.ip
  }

  get ips() {
    return this.request.ips
  }

  get hostname() {
    return this.request.hostname
  }

  get method() {
    return this.request.method
  }

  get originalUrl() {
    return this.request.originalUrl
  }

  get protocol() {
    return this.request.protocol
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

  get route() {
    return this.request.route
  }

  get secure() {
    return this.request.secure
  }

  get signedCookies() {
    return this.request.signedCookies
  }

  get fresh() {
    return this.request.fresh
  }

  get stale() {
    return this.request.stale
  }

  get xhr() {
    return this.request.xhr
  }

  get nonUrlParameters() {
    if (!this._nonUrlParameters) {
      this._nonUrlParameters = _.merge({}, this.query, this.body)
    }
    return this._nonUrlParameters
  }

  get parameters() {
    if (!this._parameters) {
      this._parameters = _.merge({}, this.query, this.params, this.body)
    }
    return this._parameters
  }
}

Controller.error(ParameterValidationError)
