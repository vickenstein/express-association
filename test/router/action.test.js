const Path = require('path')
const request = require('test/helpers/request')
const { Router } = require('dist/index')
const { Action } = require('dist/router/Action')
const { assert } = require('chai')

const UserController = require('test/example/controllers/UserController')
const HomeController = require('test/example/controllers/HomeController')
const { UserPurchase } = require('test/example/controllers/UserPurchase')
Object.defineProperty(Action, 'localPath', {
  get: function() { return Path.join(__dirname, '../example') }
})

describe('action', () => {
  describe('#path', () => {
    it('returns proper action path for root', () => {
      const router = new Router()
      const action = router.get('/')
      assert.strictEqual(action.path, '')
    })
    it('returns proper action path when namespaced', () => {
      const router = new Router().namespace('test')
      const action = router.get('/test')
      assert.strictEqual(action.path, 'test/test')
    })
    it('returns proper action path inside the collection of a resource route', () => {
      const router = new Router().namespace('test')
      const resource = router.resource('User')
      const action = resource.collection.post('test')
      assert.strictEqual(action.path, 'test/users/test')
    })
    it('returns proper action path inside the member of a resource route', () => {
      const router = new Router().namespace('test')
      const resource = router.resource('User')
      const action = resource.member.post('test')
      assert.strictEqual(action.path, 'test/users/:userId/test')
    })
    it('returns proper action path inside the member of a resource route without path', () => {
      const router = new Router().namespace('test')
      const resource = router.resource('User')
      const action = resource.member.put()
      assert.strictEqual(action.path, 'test/users/:userId')
    })
  })
  describe('#controller', () => {
    it('returns the proper controller using as syntax', () => {
      const router = new Router()
      const action = router.get('/', {
        as: 'User#index'
      })
      assert.strictEqual(action.controller, 'User')
    })
    it('returns the proper controller using controller syntax', () => {
      const router = new Router()
      const action = router.get('/', {
        controller: 'User'
      })
      assert.strictEqual(action.controller, 'User')
    })
    it('returns the proper controller under member', () => {
      const router = new Router().namespace('test')
      const resource = router.resource('User')
      const action = resource.member.post('test')
      assert.strictEqual(action.controller, 'User')
    })
    it('returns the proper controller under collection', () => {
      const router = new Router().namespace('test')
      const resource = router.resource('User')
      const action = resource.collection.put('test')
      assert.strictEqual(action.controller, 'User')
    })
    it('returns the proper controller with a sub route under member', () => {
      const router = new Router().namespace('test')
      const resource = router.resource('User')
      const route = resource.collection.route('test')
      const action = route.delete('test')
      assert.strictEqual(action.controller, 'User')
    })
    it('returns the proper action path of a resource route of a sub resource router', () => {
      const router = new Router().namespace('test')
      const resource = router.resource('UserPurchase')
      const subResource = resource.member.resource('User')
      const action = subResource.member.delete('test')
      assert.strictEqual(action.path, 'test/user_purchases/:userPurchaseId/users/:userId/test')
    })
    it('returns the proper controller under member when modified', () => {
      const router = new Router().namespace('test')
      const resource = router.resource('User')
      resource.controller('Test')
      const action = resource.member.post('test')
      assert.strictEqual(action.controller, 'Test')
    })
    it('returns the proper controller under collection when modified', () => {
      const router = new Router().namespace('test')
      const resource = router.resource('User')
      resource.controller('Test')
      const action = resource.collection.put('test')
      assert.strictEqual(action.controller, 'Test')
    })
  })
  describe('#action', () => {
    it('returns the proper action using as syntax', () => {
      const router = new Router()
      const action = router.get('/', {
        as: 'User#index'
      })
      assert.strictEqual(action.action, 'index')
    })
    it('returns the proper controller using action syntax', () => {
      const router = new Router()
      const action = router.get('/', {
        action: 'index'
      })
      assert.strictEqual(action.action, 'index')
    })
  })
  describe("Controller", () => {
    it('returns the proper Controller class', () => {
      const router = new Router().namespace('test')
      const resource = router.resource('User')
      const action = new Action({
        router: resource,
        protocol: 'get',
        path: ''
      })
      assert.strictEqual(action.Controller, UserController)
    })
    it('returns the proper Controller class', () => {
      const router = new Router().namespace('test')
      const resource = router.resource('UserPurchase')
      const action = new Action({
        router: resource,
        protocol: 'get',
        path: ''
      })
      assert.strictEqual(action.Controller, UserPurchase)
    })
    it('returns the proper Controller class using as', () => {
      const router = new Router().namespace('test')
      const action = router.get({
        as: 'Home#index'
      })
      assert.strictEqual(action.Controller, HomeController)
    })
    it('returns the proper Controller class using controller', () => {
      const router = new Router().namespace('test')
      const action = router.get({
        controller: 'Home'
      })
      assert.strictEqual(action.Controller, HomeController)
    })
  })
})
