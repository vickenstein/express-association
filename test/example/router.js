const Path = require('path')
const { Router, Action } = require('dist/index')

Object.defineProperty(Action, 'localPath', {
  get: function() { return Path.join(__dirname, '../example') }
})

module.exports = new Router(router => {
  router.namespace('test')
  router.get('test', { as: 'Api#index' })
  router.get('about', { controller: 'Api', action: 'about' })
  router.resource('User', resource => {
    resource.member.get('sub')
    resource.collection.put('put', { action: 'sub' })
    resource.collection.post('post', { action: 'sub' })
  })
})
