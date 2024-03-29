'use strict';

const express = require('express');
const bodyParser = require("body-parser");

const routerWeb = express.Router();

routerWeb.use(bodyParser.json());

/*
routerWeb.use(express.static(process.cwd()+"/node_modules/@tantalo/ngx-obu-client/"));

routerWeb.get('/', (req,res) => {
    res.sendFile(process.cwd()+"/node_modules/@tantalo/ngx-obu-client/index.html")
});
*/

routerWeb.get('/', (req, res) => {
    res.send({ message: 'Hello World from Main Web!' });
});

routerWeb.get('/privacy', (req,res) => {
    res.sendFile(process.cwd()+"/privacy.html")
});


module.exports = routerWeb;