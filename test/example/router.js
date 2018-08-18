const Path = require('path')
const { Router } = require('../../dist/index')
const { ClassFinder } = require('node-association')
Object.defineProperty(ClassFinder, 'localPath', {
  get: function() { return Path.join(__dirname, '../example') }
})

module.exports = new Router(router => {

  router.namespace('test')

  router.get('test', { as: 'Api#index' })
  router.get('about', { controller: 'Api', action: 'about' })

  router.resource('User', resource => {

    resource.collection.put('put', { action: 'sub' })
    resource.collection.post('post', { action: 'sub' })

    resource.member.get('sub')
    resource.member.resource('UserPurchase', resource => {

      resource.only('index', 'show')
      resource.member.get('fine')
      resource.member.get('not_fine', { action: 'notFine' })
      resource.member.get('error')
      resource.member.get('async_error', { action: 'asyncError' })

    })
  })
})
