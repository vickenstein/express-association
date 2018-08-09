"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Resource_1 = require("./Resource");
var Router = /** @class */ (function () {
    function Router(application, configuration) {
        this.application = application;
        configuration(this);
    }
    Router.prototype.resource = function (name, configuration) {
        var resource = new Resource_1.Resource(name);
        if (configuration)
            configuration(resource);
    };
    return Router;
}());
exports.Router = Router;
