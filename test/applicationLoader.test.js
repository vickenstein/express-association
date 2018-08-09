const request = require('test/helpers/request')
const { expect } = require('chai')

describe('initialize and setup express application', () => {
  describe('app initialized', () => {
    it('app is initialized', async () => {
      const response = await request.get('/test')
      expect(response.body).to.deep.equal({ test: 'test' })
    })
  })
})
