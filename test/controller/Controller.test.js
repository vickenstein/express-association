const request = require('test/helpers/request')
const ApiController = require('test/example/controllers/ApiController')
const UserController = require('test/example/controllers/ApiController')
const { assert } = require('chai')

describe('Controller', () => {
  describe('ApiController', () => {
    it('has the right amount of before middlewares', () => {
      assert.strictEqual(ApiController.beforeMiddlewares.length, 3)
      assert.strictEqual(UserController.beforeMiddlewares.length, 3)
    })
    it('has the right amount of middlewares', () => {
      assert.strictEqual(ApiController.middlewares('index').length, 5)
      assert.strictEqual(UserController.middlewares('index').length, 5)
    })
  })
})
