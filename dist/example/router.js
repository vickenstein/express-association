"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
exports.default = (function (app) {
    var router = new index_1.Router(app, function (router) {
        router.resource('Home', function (resource) {
            resource.only('index');
            resource.get('about');
        });
        router.resource('User', function (resource) {
            resource.only('index', 'show', 'create', 'update');
        });
    });
});
