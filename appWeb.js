'use strict';
const express = require('express');
const appWeb = express();
const routerWeb = require('./routerWeb');

appWeb.use('/',routerWeb);

module.exports = {
    appWeb: appWeb,
    portWeb: 8080
};