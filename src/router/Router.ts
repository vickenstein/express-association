import * as inflection from 'inflection'
import * as _ from 'lodash'
import { Application } from 'express'
import { Action, IActionOptions } from './Action'

const DEFAULT_RESOURCE_ACTIONS = ['index', 'show', 'create', 'update', 'delete']

export class Router {

  _path: string
  actions: any[]
  member: Router
  collection: Router
  parent: Router
  _isMember: boolean
  _controller: string
  _only: string[]
  [protocol: string]: any

  static get defaultResourceActions() {
    return DEFAULT_RESOURCE_ACTIONS
  }

  static trimSlash(string: string) {
    return string.replace(/^\/|\/$/g, '')
  }

  static splitAs(string: string) {
    return string.split('#')
  }

  constructor(configuration?: (router: Router) => void) {
    this.actions = []
    if (configuration) configuration(this)
  }

  route(path: string, configuration?: (router: Router) => void) {
    if (this.isResource) throw 'cannot create route on resources, try on resource.member | resource.collection'
    const route = new Router(configuration)
    this.actions.push(route)
    route.namespace(path)
    route.parent = this
    return route
  }

  resource(name: string, configuration?: (router: Router) => void) {
    if (this.isResource) throw 'cannot create resource on resources, try on resource.member | resource.collection'
    const resource = new Router()
    this.actions.push(resource)
    resource._path = Router.trimSlash(name)
    resource.parent = this
    resource.member = new Router()
    resource.member.parent = resource
    resource.member.isMember = true
    resource.collection = new Router()
    resource.collection.parent = resource
    resource.collection.isMember = false
    resource.actions.push(resource.member, resource.collection)
    if (configuration) configuration(resource)
    return resource
  }

  get isResource() {
    return !!this.member
  }

  set isMember(isMember: boolean) {
    this._isMember = isMember
  }

  get isMember() {
    return this._isMember === true
  }

  get isCollection() {
    return this._isMember === false
  }

  get ofResource() {
    return this.isMember || this.isCollection
  }

  namespace(namespace: string) {
    if (this.isResource || this.ofResource) throw 'cannot set namespace on resources / members / collections'
    this._path = Router.trimSlash(namespace)
    return this
  }

  only(...actions: string[]) {
    this._only = actions
    return this
  }

  get name() {
    return this._path
  }

  get collectionName() {
    return inflection.underscore(inflection.pluralize(this.name)).toLowerCase()
  }

  get memberName() {
    const name = this.parent.name
    return `:${name.charAt(0).toLowerCase()}${name.substr(1)}Id`
  }

  get path(): string {
    let path = ''

    if (this.parent) {
      path += this.parent.path
      if ((this.parent.name || this.parent.ofResource) && !this.isCollection) path += '/'
    }

    if (this.isResource) {
      return path + this.collectionName
    }

    if (this.isMember) return path + this.memberName

    if (this.isCollection) return path

    if (this.name) path += this.name

    return path
  }

  crudActions(iterator: (action: Action) => void) {
    const only = this._only || Router.defaultResourceActions
    if (_.includes(only, 'index')) {
      iterator(new Action({
        router: this.collection,
        path: '',
        protocol: 'get',
        action: 'index'
      }))
    }
    if (_.includes(only, 'show')) {
      iterator(new Action({
        router: this.member,
        path: '',
        protocol: 'get',
        action: 'show'
      }))
    }
    if (_.includes(only, 'create')) {
      iterator(new Action({
        router: this.member,
        path: '',
        protocol: 'post',
        action: 'create'
      }))
    }
    if (_.includes(only, 'update')) {
      iterator(new Action({
        router: this.member,
        path: '',
        protocol: 'put',
        action: 'update'
      }))
    }
    if (_.includes(only, 'delete')) {
      iterator(new Action({
        router: this.member,
        path: '',
        protocol: 'delete',
        action: 'delete'
      }))
    }
  }

  controller(controller: string) {
    if (!this.isResource) throw 'can only set controller on resources'
    this._controller = controller
    return this
  }

  get controllerName(): string {
    if (this._controller) return this._controller
    if (this.isResource) return this.name
    if (this.parent) return this.parent.controllerName
  }

  launchOn(application: Application) {
    this.forEachAction((action: Action) => {
      action.launchOn(application)
    })
  }

  get toJson() {
    const actions: any[] = []
    this.forEachAction(action => {
      const { url, as } = action
      actions.push({ url, as })
    })
    return actions
  }

  forEachAction(iterator: (action: Action) => void) {
    this.actions.forEach((routerOrAction: Router | Action) => {
      if (routerOrAction instanceof Action) return iterator(routerOrAction)
      routerOrAction.forEachAction(iterator)
    })
    if (this.isResource) this.crudActions(iterator)
  }
}

export interface IProtocolOptions {
  as?: string
  controller?: string
  action?: string
}

Action.protocols.forEach(protocol => {
  Router.prototype[protocol] = function(path: any = {}, options: IProtocolOptions = {}) {
    if (this.isResource) throw `cannot create ${protocol} on resources, try on resource.member | resource.collection`
    if (path instanceof Object) {
      options = path
      path = ''
    }
    const actionOptions: IActionOptions = {
      router: this,
      path,
      protocol
    }
    if (options.controller) actionOptions.controller = options.controller
    if (options.action) actionOptions.action = options.action
    if (options.as) {
      const [controller, action] = Router.splitAs(options.as)
      actionOptions.controller = controller
      actionOptions.action = action
    }
    const action = new Action(actionOptions)
    this.actions.push(action)
    return action
  }
})
