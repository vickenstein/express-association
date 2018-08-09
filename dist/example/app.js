"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router_1 = require("./router");
var app = express();
exports.app = app;
app.get('/test', function (request, response) {
    response.setHeader('content-type', 'application/json');
    response.send({ test: 'test' });
});
router_1.default(app);
