"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Resource = /** @class */ (function () {
    function Resource(name) {
    }
    Resource.prototype.resource = function (name, configuration) {
    };
    Resource.prototype.only = function () {
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
    };
    Resource.prototype.get = function (path, options) {
        if (options === void 0) { options = {}; }
    };
    Resource.prototype.post = function (path, options) {
        if (options === void 0) { options = {}; }
    };
    Resource.prototype.put = function (path, options) {
        if (options === void 0) { options = {}; }
    };
    Resource.prototype.delete = function (path, options) {
        if (options === void 0) { options = {}; }
    };
    return Resource;
}());
exports.Resource = Resource;
