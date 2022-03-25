const express = require('express');
const appServer = express();
const routesServer = require('./routerServer');

appServer.use('/',routesServer);

module.exports = {
    appServer: appServer,
    portServer: 3090,
    portServerTest: 3091
};
