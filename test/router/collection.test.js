const request = require('../helpers/request')
const { Router } = require('../../dist/index')
const { assert } = require('chai')

describe('collection', () => {
  describe('#path', () => {
    it('returns a collection of a resource route', () => {
      const router = new Router().namespace('test')
      const resource = router.resource('User')
      assert.strictEqual(resource.collection.path, 'test/users')
    })
    it('returns a route under a collection of a resource route', () => {
      const router = new Router().namespace('test')
      const resource = router.resource('User')
      const route = resource.collection.route('test')
      assert.strictEqual(route.path, 'test/users/test')
    })
  })
})
