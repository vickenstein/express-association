const request = require('../helpers/request')
const { assert } = require('chai')

const ResourceNotFoundError = require('../example/errors/ResourceNotFoundError')

describe('ApplicationError', () => {
  describe('ResourceNotFoundError', () => {
    it('returns 404 for status', () => {
      const error = new ResourceNotFoundError()
      assert.strictEqual(error.status, 404)
    })
    it('returns correct message for front end', () => {
      const error = new ResourceNotFoundError('UserPurchase is not found')
      assert.strictEqual(error.message, 'UserPurchase is not found')
    })
    it('returns correct log for backend end', () => {
      const error = new ResourceNotFoundError('UserPurchase is not found')
      assert.strictEqual(error.log, 'UserPurchase is not found')
    })
    it('returns correct log for backend end when specified', () => {
      const error = new ResourceNotFoundError('UserPurchase is not found', 'Something is not found')
      assert.strictEqual(error.log, 'Something is not found')
    })
  })
})
