const request = require('../helpers/request')
const { expect, assert } = require('chai')

describe('UserPurchase', () => {
  describe('#404', () => {
    it('caught 404 on a route', async () => {
      const response = await request.get('/test/users/1337/user_purchases/1337/non_exist')
      expect(response.body).to.deep.equal({})
      expect(response.status).to.eq(404)
    })
    it('caught not found error', async () => {
      const response = await request.get('/test/users/1337/user_purchases/1337/error')
      expect(response.body).to.deep.equal({
        type: 'ResourceNotFoundError',
        message: 'There was an error',
        status: 404
      })
    })
    it('caught not found error', async () => {
      const response = await request.get('/test/users/1337/user_purchases/1337/async_error')
      expect(response.body).to.deep.equal({
        type: 'ResourceNotFoundError',
        message: 'There was an error',
        status: 404
      })
    })
    it('caught not found error', async () => {
      const response = await request.get('/test/users/1337/user_purchases/1337/fine')
      expect(response.body).to.deep.equal({
        type: 'ResourceNotFoundError',
        message: 'There was an error',
        status: 404
      })
    })
    it('caught not found error', async () => {
      const response = await request.get('/test/users/1337/user_purchases/1337/not_fine')
      expect(response.body).to.deep.equal({
        test: 'test'
      })
    })
    it('caught an invalid error', async () => {
      const response = await request.get('/test/users/1337/user_purchases/1337?test=test')
      expect(response.body).to.deep.equal({
        type: 'ParameterValidationError',
        message: [
          {
            context: {
              key: "test",
              label: "test"
            },
            message: "\"test\" is not allowed",
            path: [
              "test"
            ],
            type: "any.unknown"
          }
        ],
        status: 422
      })
    })
  })
})
