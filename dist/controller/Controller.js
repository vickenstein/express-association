"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class Controller {
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }
    static before(middleware, options = {}) {
        if (!this._beforeMiddlewares)
            this._beforeMiddlewares = {};
        if (!this._beforeMiddlewares[this.name])
            this._beforeMiddlewares[this.name] = [];
        this._beforeMiddlewares[this.name].push([middleware, options]);
    }
    static after(middleware, options = {}) {
        if (!this._afterMiddlewares)
            this._afterMiddlewares = {};
        if (!this._afterMiddlewares[this.name])
            this._afterMiddlewares[this.name] = [];
        this._afterMiddlewares[this.name].push([middleware, options]);
    }
    static get constructorMiddleware() {
        return (request, response, next) => {
            request.controller = new this(request, response);
            next();
        };
    }
    static get beforeMiddlewares() {
        const parentMiddleware = this.__proto__.beforeMiddlewares || [];
        const localMiddleware = (this._beforeMiddlewares && this._beforeMiddlewares[this.name]) || [];
        return [...parentMiddleware, ...localMiddleware];
    }
    static get afterMiddlewares() {
        const parentMiddleware = this.__proto__.afterMiddlewares || [];
        const localMiddleware = (this._afterMiddlewares && this._afterMiddlewares[this.name]) || [];
        return [...parentMiddleware, ...localMiddleware];
    }
    static generateExpressMiddleware(middleware) {
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
    static filter(list = [], action) {
        return list.filter(([middleware, options]) => {
            if (options.only)
                return _.includes(options.only, action);
            if (options.except)
                return !_.includes(options.except, action);
            return true;
        });
    }
    static generateExpressMiddlewares(middlewares) {
        return middlewares.map(([middleware, options]) => {
            return this.generateExpressMiddleware(middleware);
        });
    }
    static middlewares(action) {
        const beforeMiddlewares = this.filter(this.beforeMiddlewares, action);
        const afterMiddlewares = this.filter(this.afterMiddlewares, action);
        return [
            this.constructorMiddleware,
            ...this.generateExpressMiddlewares(beforeMiddlewares),
            this.generateActionMiddleware(action),
            ...this.generateExpressMiddlewares(afterMiddlewares)
        ];
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
