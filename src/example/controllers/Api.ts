import { Controller } from '../../index'

@before(SomeMiddleWare, { only: 'index'})
export class ApiController extends Controller {

  index() {

  }

  static cacher() {
    return [NotFoundError, ]
  }
}
