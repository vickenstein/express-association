const request = require('test/helpers/request')
const { Router } = require('dist/index')
const { assert } = require('chai')

describe('resource', () => {
  describe('#path', () => {
    it('returns a resource route', () => {
      const router = new Router()
      const resource = router.resource('User')
      assert.strictEqual(resource.path, 'users')
    })
    it('returns a resource route of a namespaced router', () => {
      const router = new Router().namespace('test')
      const resource = router.resource('UserPurchase')
      assert.strictEqual(resource.path, 'test/user_purchases')
    })
    it('returns a resource route of a sub resource router', () => {
      const router = new Router().namespace('test')
      const resource = router.resource('UserPurchase')
      const subResource = resource.member.resource('User')
      assert.strictEqual(subResource.path, 'test/user_purchases/:userPurchaseId/users')
    })
  })
})
