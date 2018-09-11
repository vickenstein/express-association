# express-associations
Designed To Increase Productivity and Organization while using Express

## Installation
```bash
npm install --save express-association
```

## Routing
An app can have multiple routers, to create a router
```javascript
const { Router } = require('express-associaiton')
const router = new Router(router => {
  router.get('test', { as: 'Api#get' }) // resolves to GET on /test
})
router.post('test', { as: 'Api#post' }) // resolves to POST on /test
```
To configure the router, you may either use the configuration block or take the instance and call directly on it. The first style is preferred because it show nested routing with indentation.

By default routers do not have an namespace. To create a name space for an router:
```javascript
const router = new Router(router => {
  router.namespace('super_namespace/v76')
  router.get('test', { as: 'Api#get' }) // resolves to GET on /super_namespace/v76/test
})
```

To create nested routes:
```javascript
const router = new Router(router => {
  router.get('test', { as: 'Api#get' }) // resolves to GET on /test
  router.route('nested', route => {
    route.get('test', { as: 'Api#get' }) // resolves to GET on /nested/test
  })
})
```

`get`, `post`, `put`, `delete` are the 4 HTTP protocols currently supported by express-association they can be invoked by:
```javascript
const router = new Router(router => {
  router.get('get', { as: 'Api#get' }) // resolves to GET on /test
  router.post('post', { controller: 'Api', action: 'post' }) // resolves to POST on /post
  router.put('put', { as: 'Api#put' }) // resolves to POST on /put
  router.delete('delete', { as: 'Api#delete' }) // resolves to POST on /delete
})
```
Each of these resulting route is pointed at an `action` by its second parameter `as` property in the format of `Controller#Action`
an alternative method is to specify property `controller`, `action` for the route.

## Resource
A resource is a special route that is designed around a restful resource. A resource create a one to one relationship with a controller
```javascript
const router = new Router(router => {
  router.resource('User', resource => {
    resource.collection.get('test') // resolves to GET on /users/test
    resource.collection.get('another_test', { action: 'test' }) // resolves to GET on /users/another_test
    resource.member.get('test') // resolves to GET on /users/:userId/test
  })
})
```
when creating a resource, you may specify the controller that the resource logic will be implemented as in this case `User`. A resource will automatically create 2 properties - `collection` and `member`. The collection is a route that will automatically generate the namespace for the defined controller name in the plural, snake case, lowercase form. e.g. `users` for the resource `User`. The member is another route that will include which include also the id url parameter for the resource in the singular, camel case, with Id format.

A resource will also automatically generate 5 actions that are equivalent to:
`index`
```javascript
resource.collection.get('', { as: 'User#index' }) // resolves to GET on /users
```
`show`
```javascript
resource.member.get('', { as: 'User#show' }) // resolves to GET on /users/:userId
```
`create`
```javascript
resource.collection.post('', { as: 'User#create' }) // resolves to POST on /users/
```
`update`
```javascript
resource.member.put('', { as: 'User#update' }) // resolves to PUT on /users/:userId
```
`delete`
```javascript
resource.member.delete('', { as: 'User#delete' }) // resolves to DELETE on /users/:userId
```

To not generate these routes or only a few of them you can do:
```javascript
const router = new Router(router => {
  router.resource('User', resource => {
    resource.only('index', 'show')
  })
})
```
This will restrict the automatically created actions to only index and show.

## Controller
Controllers are used to group related logic as actions. Controllers are extended from the base class Controller.
```javascript
const { Controller } = require('express-association')

class UserController extend Controller {

}
```
To learn more about how to name and export your controller, please review ClassFinder of [node-associaiton](https://www.npmjs.com/package/node-association)

## Actions
Are instance function on the controller. Each route is mapped to one of these.
an action can be either async or sync function without any arguments.
During an request, express association will create an instance of the controller. When performing the action, this instance is the the scope `this`. You can access the request, and response from this. e.g.
```javascript
class UserController extend Controller {
  async action() {
    this.send({
      request: this.request,
      response: this.response
    })
  }
}
```
The above action performs the `User#action` method. express-association has many express function mapping for the request and response, e.g. `send` to simplify middleware creation. this example sends the request and response out as json.

### Before
The action is where the meat / main logic of an request should be implemented. Auxiliary middleware for permission verification, An random express middleware plugin that you have found on the internet, etc are set up as a before function.
```javascript
const someBeforeMiddlewareFunction = (request, response, next) => {
  console.log('I am a middleware!')
  next()
}
UserController.before(someBeforeMiddlewareFunction)
```

To scope the middleware functions to specific actions on the controller in two ways:
```javascript
UserController.before(someBeforeMiddlewareFunction, {
  only: ['index']
})
```
Only specify that this middleware will `only` be used before the declared actions.
```javascript
UserController.before(someBeforeMiddlewareFunction, {
  only: ['index']
})
```
Except will do the opposite and run the middleware on all actions `except` the declared actions.

### After
After middleware are design for processing error handling. you can define a 4 argument express middleware:
```
const someAfterMiddlewareFunction = (error, request, response, next) => {
  console.log('I am a middleware!')
  next(error)
}
UserController.after(someAfterMiddlewareFunction)
```
After middleware can also be specified on the controller as a instance function similar to actions. For these functions the error can be accessed via `this.error`
```javascript
class UserController extend Controller {
  async someAfterMiddleware() {
    console.log(this.error)
    throw this.error
  }
}
```
Unless the error is handled, an after controller as instance method should throw the error again.
The scoping of after middleware can be done using `only` and `except` in the same way as before middleware

### Parameter Validation
Parameter validation for express-association is implemented using [JOI](https://www.npmjs.com/package/joi)
```javascript
const Joi = require('joi')
UserController.parameter('firstName', Joi.string().required(), {
  only: ['index']
})
```
express-association combines all query and body request parameters for validation. and can scope to specific action similar to before middleware

### Error
Many types of errors can be generated by a request. All unhandled errors will be converted to an UncaughtError by express-association with the default status of 500. All parameter validation will be converted to an ParameterValidationError with the default status of 422. To create custom errors
```javascript
const { ApplicationError } = require('express-association')
class IAmATeaPotError extend ApplicationError {
  constructor(message = 'Something went wrong', log = 'I am a tea pot') {
    super(message, log)
  }
  static get status() {
    return 418
  }
}
UserController.error(IAmATeaPotError)
```
Based on the above scenario, all Thrown `IAmATeaPotError` will be handled. It will log to console 'I am a team pot' and return 'something went wrong as the message' as an response to the request.
