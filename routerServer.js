'use strict';

const db_host = 'localhost';
const db_user = 'root';
const db_pwd = 'newpass';
const database = 'itip2'

const express = require('express');
const routerServer = express.Router();
var cors = require('cors');
var bodyParser = require('body-parser');
var mysql      = require('mysql');

var macAddressUserDB = {};


    routerServer.use(cors());
    routerServer.use( bodyParser.json() );       // to support JSON-encoded bodies
    routerServer.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
    }));

    routerServer.get('/', (req,res)=>{
        res.send({message: 'Hello World from Main Server!'});
    });


    routerServer.post('/log', (req,res) => {
        var ssid = req.body.ssid;
        var pwd = req.body.pwd;
        console.log('pwd: ' + pwd);
    });

    routerServer.post('/getUserDb', (req,res) => {
        var macAddress = req.body.macAddress;
        console.log('macAddress: ' + macAddress);
        let userDb = getUserDb(macAddress);
        res.send(userDb);
    });

    function getUserDb(macAddress) {
        if (macAddressUserDB[macAddress] && macAddressUserDB[macAddress].trim() !== "") {
            return macAddressUserDB[macAddress];
        }

        let rtn = null;
        var connection = getConnection();
        connection.connect();

        connection.query('SELECT UserDb from ' + database + '.MacAddressUserDB where MacAddress = ?', macAddress, function (error, results, fields) {
            if (error) {
                console.log('Error selecting user db', error);
            } else {
                rtn = results[0].UserDb;
                macAddressUserDB[macAddress] = rtn;
            }
          });

        connection.end();

        return rtn;
    }

    function getConnection() {
        var connection = mysql.createConnection({
            host     : db_host,
            user     : db_user,
            password : db_pwd,
            database : database
        });
        return connection;
    }


module.exports = routerServer;