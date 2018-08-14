const request = require('test/helpers/request')
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
  })
})
