"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const fs = require("fs");
const Router_1 = require("./Router");
const Controller_1 = require("../controller/Controller");
const PROTOCOLS = ['get', 'post', 'put', 'delete'];
let localPath = Path.join(__dirname, '../../..');
if (Path.basename(localPath) === 'node_modules') {
    localPath = Path.join(localPath, '..');
}
let controllerPath;
class Action {
    static get protocols() {
        return PROTOCOLS;
    }
    static get localPath() {
        return localPath;
    }
    static get controllerPath() {
        if (controllerPath)
            return controllerPath;
        if (fs.existsSync(Path.join(this.localPath, 'controllers'))) {
            return controllerPath = Path.join(this.localPath, 'controllers');
        }
        if (fs.existsSync(Path.join(this.localPath, 'dist/controllers'))) {
            return controllerPath = Path.join(this.localPath, 'dist/controllers');
        }
        if (fs.existsSync(Path.join(this.localPath, 'src/controllers'))) {
            return controllerPath = Path.join(this.localPath, 'src/controllers');
        }
        throw 'cannot find controller directory';
    }
    constructor({ router, path, protocol, controller, action }) {
        this.protocol = protocol;
        this.router = router;
        this._path = Router_1.Router.trimSlash(path);
        this._controller = controller;
        this._action = action;
    }
    get action() {
        if (this._action)
            return this._action;
        if (this._path.match(/^\w+$/))
            return this._path;
    }
    get controller() {
        const controller = this._controller || this.router.controllerName;
        if (controller)
            return controller;
        throw `${this.path} action missing controller`;
    }
    get as() {
        return `${this.controller}#${this.action}`;
    }
    get path() {
        let path = this.router.path;
        if (path && this._path)
            path += '/';
        return path + this._path;
    }
    get url() {
        return '/' + this.path;
    }
    get Controller() {
        let Controller;
        try {
            Controller = require(Path.join(Action.controllerPath, this.controller + 'Controller'));
        }
        catch (error) {
            try {
                Controller = require(Path.join(Action.controllerPath, this.controller));
            }
            catch (error) {
                throw error;
            }
        }
        if (typeof Controller === 'function')
            return Controller;
        if (Controller[this.controller + 'Controller'])
            return Controller[this.controller + 'Controller'];
        if (Controller[this.controller])
            return Controller[this.controller];
        throw 'the imported controller does not seem to be an controller';
    }
    get errors() {
        return Controller_1.Controller.filter(this.Controller.inheritedErrors, this.action).map(([error, options]) => `${error.name}: ${error.status || 500}`).join(', ');
    }
    get parameterFields() {
        const parameterFields = [];
        Object.keys(this._parameters).forEach(key => {
            const validator = this._parameters[key];
            const type = validator.type;
            const presence = validator.flags && validator.flags.presence;
            if (presence === 'forbidden')
                return;
            parameterFields.push(`${key}: ${type}${presence === 'required' ? ' - required' : ''}`);
        });
        return parameterFields.join(', ');
    }
    get _parameters() {
        const parameters = {};
        Controller_1.Controller.filter(this.Controller.inheritedParameters, this.action).forEach(([[key, validator], options]) => {
            parameters[key] = validator.describe();
        });
        return parameters;
    }
    get parameters() {
        return JSON.stringify(this._parameters);
    }
    launchOn(application) {
        application[this.protocol](this.url, ...this.Controller.middlewares(this.action));
    }
}
exports.Action = Action;
