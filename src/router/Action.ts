import * as Path from 'path'
import * as fs from 'fs'
import * as _ from 'lodash'
import * as express from 'express'
import { Router } from './Router'
import { Controller } from '../controller/Controller'
import { ClassFinder } from 'node-association'
const PROTOCOLS = ['get', 'post', 'put', 'delete']

let localPath = Path.join(__dirname, '../../..')
if (Path.basename(localPath) === 'node_modules') {
  localPath = Path.join(localPath, '..')
}

let controllerPath: string

declare module 'express' {

  export interface Application {
    [protocol: string]: any
  }

}

export interface IActionOptions {
  router: Router
  protocol: string
  path: string
  controller?: string
  action?: string
}

export class Action {

  router: Router
  protocol: string
  _path: string
  _controller: string
  _action: string

  static get protocols() {
    return PROTOCOLS
  }

  constructor({router, path, protocol, controller, action}: IActionOptions) {
    this.protocol = protocol
    this.router = router
    this._path = Router.trimSlash(path)
    this._controller = controller
    this._action = action
  }

  get action() {
    if (this._action) return this._action
    if (this._path.match(/^\w+$/)) return this._path
  }

  get controller() {
    const controller = this._controller || this.router.controllerName
    if (controller) return controller
    throw `${this.path} action missing controller`
  }

  get as() {
    return `${this.controller}#${this.action}`
  }

  get path() {
    let path = this.router.path
    if (path && this._path) path += '/'
    return path + this._path
  }

  get url() {
    return '/' + this.path
  }

  get Controller() {
    return ClassFinder.classFor(this.controller, 'Controller')
  }

  get _errors() {
    return Controller.filter(this.Controller.inheritedErrors, this.action)
  }

  get errors() {
    return this._errors.map(([error, options]) => _.pick(new error, ['status', 'message', 'log', 'type']))
  }

  get errorStatuses() {
    return this._errors.map(([error, options]) => `${error.name}: ${error.status || 500}`).join(', ')
  }

  get parameterFields() {
    const parameterFields: string[] = []
    Object.keys(this.parameters).forEach(key => {
      const validator = this.parameters[key]
      const type = validator.type
      const presence = validator.flags && validator.flags.presence
      if (presence === 'forbidden') return
      parameterFields.push(`${key}: ${type}${presence === 'required' ? ' - required' : ''}`)
    })
    return parameterFields.join(', ')
  }

  get parameters() {
    const parameters: any = {}
    Controller.filter(this.Controller.inheritedParameters, this.action).forEach(([[key, validator], options]) => {
      parameters[key] = validator.describe()
    })
    return parameters
  }

  launchOn(application: express.Application) {
    application[this.protocol](this.url, ...this.Controller.middlewares(this.action))
  }
}
