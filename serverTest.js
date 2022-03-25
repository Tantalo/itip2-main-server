'use strict';

//const web = require('./appWeb')
const server = require('./appServer')

/*
web.appWeb.listen(web.portWeb, () => {
	console.log(`API REST running in http://localhost:${web.portWeb}`);
});
*/

server.appServer.listen(server.portServerTest, () => {
	console.log(`API REST running in http://localhost:${server.portServerTest}`);
});

