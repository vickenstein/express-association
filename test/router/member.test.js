const request = require('test/helpers/request')
const { Router } = require('dist/index')
const { assert } = require('chai')

describe('member', () => {
  describe('#path', () => {
    it('returns a member of a resource route', () => {
      const router = new Router().namespace('test')
      const resource = router.resource('User')
      assert.strictEqual(resource.member.path, 'test/users/:userId')
    })
    it('returns a route under a member of a resource route', () => {
      const router = new Router().namespace('test')
      const resource = router.resource('User')
      const route = resource.member.route('test')
      assert.strictEqual(route.path, 'test/users/:userId/test')
    })
  })
})
