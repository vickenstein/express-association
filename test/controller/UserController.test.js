const request = require('../helpers/request')
const { expect, assert } = require('chai')

describe('UserController', () => {
  describe('#index', () => {
    it('received a proper response from User#index', async () => {
      const response = await request.get('/test/users')
      expect(response.body).to.deep.equal({ index: 'index' })
      assert.strictEqual(response.headers.test, '1337')
      assert.strictEqual(response.headers.asynctest, '1337')
      assert.strictEqual(response.headers.token, 'user')
    })
  })
  describe('#show', () => {
    it('received a proper response from User#show', async () => {
      const response = await request.get('/test/users/1337')
      expect(response.body).to.deep.equal({ show: '1337' })
      assert.strictEqual(response.headers.test, '1337')
      assert.strictEqual(response.headers.asynctest, '1337')
      assert.strictEqual(response.headers.token, 'user')
    })
  })
  describe('#create', () => {
    it('received a proper response from User#create', async () => {
      const response = await request.post('/test/users').send({
        test: 'test'
      })
      expect(response.body).to.deep.equal({ create: 'test' })
      assert.strictEqual(response.headers.test, '1337')
      assert.strictEqual(response.headers.asynctest, '1337')
      assert.strictEqual(response.headers.token, 'user')
    })
  })
  describe('#update', () => {
    it('received a proper response from User#update', async () => {
      const response = await request.put('/test/users/1337').send({
        test: 'test'
      })
      expect(response.body).to.deep.equal({ update: 'test' })
      assert.strictEqual(response.headers.test, '1337')
      assert.strictEqual(response.headers.asynctest, '1337')
      assert.strictEqual(response.headers.token, 'user')
    })
  })
  describe('#delete', () => {
    it('received a proper response from User#delete', async () => {
      const response = await request.delete('/test/users/1337')
      expect(response.body).to.deep.equal({ delete: '1337' })
      assert.strictEqual(response.headers.test, '1337')
      assert.strictEqual(response.headers.asynctest, '1337')
      assert.strictEqual(response.headers.token, 'user')
    })
  })
  describe('#member.sub', () => {
    it('received a proper response from Api#index', async () => {
      const response = await request.get('/test/users/1337/sub')
      expect(response.body).to.deep.equal({ test: '1337' })
      assert.strictEqual(response.headers.test, '1337')
      assert.strictEqual(response.headers.asynctest, '1337')
      assert.strictEqual(response.headers.token, 'user')
    })
  })
  describe('#collection.put', () => {
    it('received a proper response from Api#index', async () => {
      const response = await request.put('/test/users/put').send({
        test: 'test'
      })
      expect(response.body).to.deep.equal({ test: 'test' })
      assert.strictEqual(response.headers.test, '1337')
      assert.strictEqual(response.headers.asynctest, '1337')
      assert.strictEqual(response.headers.token, 'user')
    })
  })
  describe('#collection.post', () => {
    it('received a proper response from Api#index', async () => {
      const response = await request.post('/test/users/post').send({
        test: 'test'
      })
      expect(response.body).to.deep.equal({ test: 'test' })
      assert.strictEqual(response.headers.test, '1337')
      assert.strictEqual(response.headers.asynctest, '1337')
      assert.strictEqual(response.headers.token, 'user')
    })
  })
})
