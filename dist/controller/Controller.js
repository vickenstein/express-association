"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const _ = require("lodash");
const ParameterValidationError_1 = require("./ParameterValidationError");
class Controller {
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }
    errorHandler(error) {
        console.log({
            type: error.type,
            log: error.log,
            status: error.status
        });
        // @ts-ignore: method intended for controller instance
        this.status(error.status);
        // @ts-ignore: method intended for controller instance
        this.send({
            type: error.type,
            message: error.message,
            status: error.status
        });
    }
    static parameterValidationFunction(parameters) {
        const JoiSchema = {};
        parameters.forEach(([[key, validator], options]) => {
            JoiSchema[key] = validator;
        });
        const schema = Joi.object(JoiSchema);
        return (parameters) => {
            const result = schema.validate(parameters);
            if (result.error)
                throw new ParameterValidationError_1.ParameterValidationError(result.error.details, result.error.message);
        };
    }
    static before(middleware, options = {}) {
        if (!this.beforeMiddlewares)
            this.beforeMiddlewares = {};
        if (!this.beforeMiddlewares[this.name])
            this.beforeMiddlewares[this.name] = [];
        this.beforeMiddlewares[this.name].push([middleware, options]);
    }
    static after(middleware, options = {}) {
        if (!this.afterMiddlewares)
            this.afterMiddlewares = {};
        if (!this.afterMiddlewares[this.name])
            this.afterMiddlewares[this.name] = [];
        this.afterMiddlewares[this.name].push([middleware, options]);
    }
    static error(errorClass, options = {}) {
        if (!this.errors)
            this.errors = {};
        if (!this.errors[this.name])
            this.errors[this.name] = [];
        this.errors[this.name].push([errorClass, options]);
    }
    static parameter(key, validator, options = {}) {
        if (!this.parameters)
            this.parameters = {};
        if (!this.parameters[this.name])
            this.parameters[this.name] = [];
        this.parameters[this.name].push([[key, validator], options]);
    }
    static inheritedProperties(key) {
        // @ts-ignore: method intended for controller instance
        let inheritedProperties = (this[key] && this[key][this.name]) || [];
        let proto = this.__proto__;
        while (proto) {
            inheritedProperties = ((proto[key] && proto[key][proto.name]) || []).concat(inheritedProperties);
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
    static get inheritedParameters() {
        return this.inheritedProperties('parameters');
    }
    static constructorMiddleware(action) {
        return (request, response, next) => {
            request.controller = new this(request, response);
            request.controller.controller = this.name.match(/(\w+)(Controller)?/)[1];
            request.controller.action = action;
            response.locals = request.controller;
            next();
        };
    }
    static generateActionMiddleware(action) {
        const middleware = this.prototype[action];
        if (middleware.constructor.name === 'AsyncFunction') {
            return (request, response, next) => {
                middleware.bind(request.controller)().catch(next);
            };
        }
        return (request, response) => {
            middleware.bind(request.controller)();
        };
    }
    static generateErrorHandlerMiddleware(errors) {
        return (error, request, response, next) => {
            if (_.includes(errors, error.constructor))
                return request.controller.errorHandler(error);
            next(error);
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
                    request.controller.error = error;
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
    static generateParameterValidationMiddlewares(parameters) {
        const parameterValidationFunction = this.parameterValidationFunction(parameters);
        return (request, response, next) => {
            parameterValidationFunction(request.controller.nonUrlParameters);
            next();
        };
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
        const parameters = this.filter(this.inheritedParameters, action);
        return [
            this.constructorMiddleware(action),
            this.generateParameterValidationMiddlewares(parameters),
            ...this.generateBeforeMiddlewares(beforeMiddlewares),
            this.generateActionMiddleware(action),
            ...this.generateAfterMiddlewares(afterMiddlewares),
            this.generateErrorHandlerMiddleware(errors)
        ];
    }
    //response
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
    redirect(status, url) {
        this.response.redirect(status, url);
    }
    render(view, options, callback) {
        this.response.render(view, options, callback);
    }
    //request
    get(field) {
        return this.request.get(field);
    }
    get ip() {
        return this.request.ip;
    }
    get ips() {
        return this.request.ips;
    }
    get hostname() {
        return this.request.hostname;
    }
    get method() {
        return this.request.method;
    }
    get originalUrl() {
        return this.request.originalUrl;
    }
    get protocol() {
        return this.request.protocol;
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
    get route() {
        return this.request.route;
    }
    get secure() {
        return this.request.secure;
    }
    get signedCookies() {
        return this.request.signedCookies;
    }
    get fresh() {
        return this.request.fresh;
    }
    get stale() {
        return this.request.stale;
    }
    get xhr() {
        return this.request.xhr;
    }
    get nonUrlParameters() {
        if (!this._nonUrlParameters) {
            this._nonUrlParameters = _.merge({}, this.query, this.body);
        }
        return this._nonUrlParameters;
    }
    get parameters() {
        if (!this._parameters) {
            this._parameters = _.merge({}, this.query, this.params, this.body);
        }
        return this._parameters;
    }
}
exports.Controller = Controller;
Controller.error(ParameterValidationError_1.ParameterValidationError);
