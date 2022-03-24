'use strict';

const db_host = 'localhost';
const db_user = 'root';
const db_pwd = 'Giacobbe$1';
const ITIP_DB = 'ITIP_mainDB';
const TCS_DB = 'TCS_mainDB'
const IPH_DB = 'IPH_mainDB'

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


    //for ITIP
    routerServer.post('/log', (req,res) => {
        console.log('body: ', req.body);
        var macAddress = req.body.macAddress;
        var logCommands = req.body.logCommands;
        var logEvents = req.body.logEvents;

        getUserDB(macAddress, ITIP_DB).then(userDB => {
            try {
                var connection = getConnection(userDB);
                connection.connect();

                const promise1 = new Promise((resolve, reject) => {
                    if (Array.isArray(logCommands) && logCommands.length > 0) {
                        connection.query('insert into LogCommands (MacAddress, Timestamp, Command, Status) values ?',
                        [Array.from(logCommands, cmd => [macAddress, cmd.timestamp, cmd.command, cmd.status])], function (err, result) {
                            if (err) {
                                console.log('LogCommands: ', err);
                            } else {
                                console.log("Number of LogCommands inserted: " + result.affectedRows);
                            }
                            resolve(true);
                        });
                    } else {
                        resolve(true);
                    }
                });

                const promise2 = new Promise((resolve, reject) => {
                    if (Array.isArray(logEvents) && logEvents.length > 0) {
                        connection.query('insert into LogEvents (MacAddress, Timestamp, EventName) values ?',
                        [Array.from(logEvents, cmd => [macAddress, cmd.timestamp, cmd.eventName])], function (err, result) {
                            if (err) {
                                console.log('LogEvents: ', err);
                            } else {
                                console.log("Number of LogEvents inserted: " + result.affectedRows);
                            }
                            resolve(true);
                        });
                    } else {
                        resolve(true);
                    }
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

    //for tcs & IPH
    routerServer.post('/logTruck', (req,res) => {
        console.log('body: ', req.body);
        var logs = req.body.logs;
        var db_prefix = req.body.db_prefix;

        var db = db_prefix + '_DB';

        getUserDB(macAddress, db).then(userDB => {
            try {
                var connection = getConnection(userDB);
                connection.connect();

                const promise1 = new Promise((resolve, reject) => {
                    if (Array.isArray(logs) && logs.length > 0) {
                        connection.query('insert into LogCommands (MacAddress, Timestamp, Command, Username) values ?',
                        [Array.from(logs, cmd => [cmd.mac, cmd.date, cmd.operation, cmd.username])], function (err, result) {
                            if (err) {
                                console.log('LogCommands: ', err);
                            } else {
                                console.log("Number of LogCommands inserted: " + result.affectedRows);
                            }
                            resolve(true);
                        });
                    } else {
                        resolve(true);
                    }
                });

                Promise.all([promise1]).then(() => {
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
        var db = req.body.db;
        console.log('macAddress: ' + macAddress);
        console.log('db: ' + db);
        getUserDB(macAddress, db).then(userDB => {
            res.send(userDB);
        });
    });

    function getUserDB(macAddress, db) {
        return new Promise((resolve, reject) => {
            if (macAddressUserDB[macAddress] && macAddressUserDB[macAddress].trim() !== "") {
                resolve(macAddressUserDB[macAddress]);
            } else {
                let rtn = null;

                try {
                    var connection = getConnection(db);
                    connection.connect();

                    connection.query('SELECT UserDB from ' + db + '.MacAddressUserDB where MacAddress = ?', macAddress, function (error, results, fields) {

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

    routerServer.post('/keep-alive', (req,res) => {
        console.log('body: ', req.body);
        var timestamp = req.body.timestamp;
        var macAddress = req.body.macAddress;

        var remoteIp = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
        remoteIp = remoteIp.split(',')[0];
        remoteIp = remoteIp.split(':').slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"

        console.log('remoteIp: ' + remoteIp);

        try {
            var connection = getConnection(ITIP_DB);
            connection.connect();

            connection.query('update ' + ITIP_DB + '.MacAddressUserDB set Timestamp = ?, IpAddress = ? where MacAddress = ?',
            [timestamp, remoteIp, macAddress], function (err, result) {
                if (err) {
                    console.log('keep-alive: ', err);
                    res.send(err);
                } else {
                    console.log("Number of keep-alive rows updated: " + result.affectedRows);
                    res.send('Ok');
                }
            });

        } catch(e) {
            console.log('keep-alive: ', e);
            res.send(e);
        } finally {
            if (connection)
                connection.end();
        }


    });

    function getConnection(db) {
        var connection = mysql.createConnection({
            host     : db_host,
            user     : db_user,
            password : db_pwd,
            database : db
        });
        return connection;
    }


module.exports = routerServer;