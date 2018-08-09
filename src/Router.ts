import { Application } from "express"
import { Resource } from "./Resource"

export class Router {

  private application: Application

  constructor(application: Application, configuration?: (router: Router) => void ) {
    this.application = application
    configuration(this)
  }

  resource(name: string, configuration?: (resource: Resource) => void ) {
    const resource = new Resource(name)
    if (configuration) configuration(resource)
  }
}
