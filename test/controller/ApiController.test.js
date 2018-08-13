const request = require('test/helpers/request')
const { expect, assert } = require('chai')

describe('ApiController', () => {
  describe('#index', () => {
    it('received a proper response from Api#index', async () => {
      const response = await request.get('/test/test')
      expect(response.body).to.deep.equal({ test: 'test' })
      assert.strictEqual(response.headers.test, '1337')
      assert.strictEqual(response.headers.asynctest, '1337')
      assert.strictEqual(response.headers.token, '1337')
    })
  })
  describe('#about', () => {
    it('received a proper response from Api#index', async () => {
      const response = await request.get('/test/about')
      expect(response.body).to.deep.equal({ about: 'about' })
      assert.strictEqual(response.headers.test, '1337')
      assert.notOk(response.headers.asynctest)
      assert.notOk(response.headers.token)
    })
  })
})
