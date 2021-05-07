'use strict';

const express = require('express');
const routerServer = express.Router();
var cors = require('cors');
var bodyParser = require('body-parser')


    routerServer.use(cors());
    routerServer.use( bodyParser.json() );       // to support JSON-encoded bodies
    routerServer.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
    }));

    routerServer.get('/', (req,res)=>{
        res.send({message: 'Hello World Main Server!'});
    });


    routerServer.post('/log', (req,res) => {
        var ssid = req.body.ssid;
        var pwd = req.body.pwd;
        console.log('pwd: ' + pwd);



    });



module.exports = routerServer;