import express = require('express')
import { Router } from '../index'

export default (app: express.Application) => {
  const router = new Router(app, router => {
    router.resource('Home', resource => {
      resource.controller('About')
      resource.only('index')
      resource.get('about', { action: '#somethingelse'})
    })
    router.resource('User', resource => {
      resource.only('index', 'show', 'create', 'update')
      resource.resource('Post')
    })
  })
}
