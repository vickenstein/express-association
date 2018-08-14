"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class Controller {
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }
    errorHandler(error) {
        console.log({
            type: error.constructor.name,
            log: error.log,
            status: error.status
        });
        // @ts-ignore: method intended for controller instance
        this.status(error.status);
        // @ts-ignore: method intended for controller instance
        this.send({
            type: error.constructor.name,
            message: error.message,
            status: error.status
        });
    }
    static before(middleware, options = {}) {
        if (!this.beforeMiddlewares)
            this.beforeMiddlewares = [];
        this.beforeMiddlewares = this.beforeMiddlewares.concat([[middleware, options]]);
    }
    static after(middleware, options = {}) {
        if (!this.afterMiddlewares)
            this.afterMiddlewares = [];
        this.afterMiddlewares = this.afterMiddlewares.concat([[middleware, options]]);
    }
    static constructorMiddleware(action) {
        return (request, response, next) => {
            request.controller = new this(request, response);
            request.controller.controller = this.name.match(/(\w+)(Controller)?/)[1];
            request.controller.action = action;
            next();
        };
    }
    static error(errorClass, options = {}) {
        if (!this.errors)
            this.errors = [];
        this.errors = this.errors.concat([[errorClass, options]]);
    }
    static inheritedProperties(key) {
        // @ts-ignore: method intended for controller instance
        let inheritedProperties = this[key] || [];
        let proto = this.__proto__;
        while (proto[key]) {
            inheritedProperties = proto[key].concat(inheritedProperties);
            proto = proto.__proto__;
        }
        return inheritedProperties;
    }
    static get inheritedBeforeMiddlewares() {
        return this.inheritedProperties('beforeMiddlewares');
    }
    static get inheritedAfterMiddlewares() {
        return this.inheritedProperties('afterMiddlewares');
    }
    static get inheritedErrors() {
        return this.inheritedProperties('errors');
    }
    static actionErrors(action) {
    }
    static generateActionMiddleware(action) {
        const middleware = this.prototype[action];
        if (middleware.constructor.name === 'AsyncFunction') {
            return (request, response) => {
                middleware.bind(request.controller)().catch((error) => {
                    throw error;
                });
            };
        }
        return (request, response) => {
            middleware.bind(request.controller)();
        };
    }
    static generateErrorHandlerMiddleware(errors) {
        return (error, request, response, next) => {
            console.log(errors, error.constructor);
            if (_.includes(errors, error.constructor))
                request.controller.errorHandler(error);
            next();
        };
    }
    static filter(list = [], action) {
        return list.filter(([thing, options]) => {
            if (options.only)
                return _.includes(options.only, action);
            if (options.except)
                return !_.includes(options.except, action);
            return true;
        });
    }
    static generateBeforeMiddleware(middleware) {
        if (typeof middleware === 'string')
            middleware = this.prototype[middleware];
        if (!middleware.length) {
            if (middleware.constructor.name === 'AsyncFunction') {
                return (request, response, next) => {
                    middleware.bind(request.controller)().then(next).catch(next);
                };
            }
            return (request, response, next) => {
                middleware.bind(request.controller)();
                next();
            };
        }
        return middleware;
    }
    static generateBeforeMiddlewares(middlewares) {
        return middlewares.map(([middleware, options]) => {
            return this.generateBeforeMiddleware(middleware);
        });
    }
    static generateAfterMiddleware(middleware) {
        if (typeof middleware === 'string')
            middleware = this.prototype[middleware];
        if (!middleware.length) {
            if (middleware.constructor.name === 'AsyncFunction') {
                return (error, request, response, next) => {
                    if (!error)
                        return next();
                    middleware.bind(request.controller)().then(next).catch(next);
                };
            }
            return (error, request, response, next) => {
                if (!error)
                    return next();
                request.controller.error = error;
                middleware.bind(request.controller)();
                next();
            };
        }
    }
    static generateAfterMiddlewares(middlewares) {
        return middlewares.map(([middleware, options]) => {
            return this.generateAfterMiddleware(middleware);
        });
    }
    static middlewares(action) {
        const beforeMiddlewares = this.filter(this.inheritedBeforeMiddlewares, action);
        const afterMiddlewares = this.filter(this.inheritedAfterMiddlewares, action);
        const errors = this.filter(this.inheritedErrors, action).map(([error, options]) => error);
        return [
            this.constructorMiddleware(action),
            ...this.generateBeforeMiddlewares(beforeMiddlewares),
            this.generateActionMiddleware(action),
            ...this.generateAfterMiddlewares(afterMiddlewares),
            this.generateErrorHandlerMiddleware(errors)
        ];
    }
    status(code) {
        this.response.status(code);
    }
    setHeader(name, value) {
        this.response.setHeader(name, value);
    }
    json(body) {
        this.response.json(body);
    }
    send(body) {
        this.response.send(body);
    }
    get query() {
        return this.request.query;
    }
    get params() {
        return this.request.params;
    }
    get body() {
        return this.request.body;
    }
    get parameters() {
        if (!this._parameters) {
            this._parameters = _.merge({}, this.query, this.params, this.body);
        }
        return this._parameters;
    }
}
exports.Controller = Controller;
