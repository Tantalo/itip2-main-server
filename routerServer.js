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
        console.log('body: ', req.body);
        var macAddress = req.body.macAddress;
        var logCommands = req.body.logCommands;
        var logEvents = req.body.logEvents;

        getUserDB(macAddress).then(userDB => {
            try {
                var connection = getConnection(userDB);
                connection.connect();

                const promise1 = new Promise((resolve, reject) => {
                    con.query('insert into LogCommands (MacAddress, Timestamp, Command, Status) values ?',
                    Array.from(logCommands, cmd => [macAddress, cmd.timestamp, cmd.command, cmd.status]), function (err, result) {
                        if (err) {
                            console.log('LogCommands: ', err);
                        } else {
                            console.log("Number of LogCommands inserted: " + result.affectedRows);
                        }
                        promise1.resolve(true);
                    });
                });

                const promise2 = new Promise((resolve, reject) => {
                    con.query('insert into LogEvents (MacAddress, Timestamp, EventName) values ?',
                    Array.from(logEvents, cmd => [macAddress, cmd.timestamp, cmd.eventName]), function (err, result) {
                        if (err) {
                            console.log('LogEvents: ', err);
                        } else {
                            console.log("Number of LogEvents inserted: " + result.affectedRows);
                        }
                        promise2.resolve(true);
                    });
                });

                Promise.all([promise1, promise2]).then(() => {
                    res.send('Ok');
                });
            } catch(e) {
                res.send(e);
            } finally {
                if (connection)
                    connection.end();
            }
        });

    });

    routerServer.post('/getUserDB', (req,res) => {
        var macAddress = req.body.macAddress;
        console.log('macAddress: ' + macAddress);
        getUserDB(macAddress).then(userDB => {
            res.send(userDB);
        });
    });

    function getUserDB(macAddress) {
        return new Promise((resolve, reject) => {
            if (macAddressUserDB[macAddress] && macAddressUserDB[macAddress].trim() !== "") {
                resolve(macAddressUserDB[macAddress]);
            } else {
                let rtn = null;

                try {
                    var connection = getConnection();
                    connection.connect();

                    connection.query('SELECT UserDB from ' + database + '.MacAddressUserDB where MacAddress = ?', macAddress, function (error, results, fields) {

                        if (error) {
                            console.log('Error selecting user db', error);
                        } else {
                            console.log('results[0]: ', results[0]);
                            rtn = results[0].UserDB;
                            macAddressUserDB[macAddress] = rtn;
                        }

                        resolve(rtn);
                    });
                } catch (e) {
                    console.log('Error in getUserDB', e);
                    reject(e);
                } finally {
                    if (connection)
                        connection.end();
                }
            }
        });
    }

    function getConnection(db) {
        var connection = mysql.createConnection({
            host     : db_host,
            user     : db_user,
            password : db_pwd,
            database : db ? db : database
        });
        return connection;
    }


module.exports = routerServer;