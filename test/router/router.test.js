const request = require('../helpers/request')
const { Router } = require('../../dist/index')
const { assert } = require('chai')

describe('router', () => {
  describe('#path', () => {
    it('returns the proper path when default', () => {
      const router = new Router()
      assert.strictEqual(router.path, '')
    })
    it('returns the proper path when namespaced', () => {
      const router = new Router().namespace('test')
      assert.strictEqual(router.path, 'test')
    })
    it('returns a sub route of router', () => {
      const router = new Router()
      const route = router.route('test')
      assert.strictEqual(route.path, 'test')
    })
    it('returns a sub route of a namespaced router', () => {
      const router = new Router().namespace('test')
      const route = router.route('test')
      assert.strictEqual(route.path, 'test/test')
    })
    it('trims leading slash from path', () => {
      const router = new Router().namespace('/test')
      const resource = router.resource('User')
      const route = resource.member.route('/test')
      assert.strictEqual(route.path, 'test/users/:userId/test')
    })
  })
})
