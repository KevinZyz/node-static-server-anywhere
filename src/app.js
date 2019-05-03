const http = require('http');
const path = require('path');
const chalk = require('chalk');
const conf = require('./config/defaultConfig');
const route = require('./helper/route');

const Server = http.createServer(async (req, res) => {
	const filePath = path.join(conf.root, req.url);
	route(req, res, filePath, conf);
});

Server.listen(conf.port, conf.hostname, () => {
	const addr = `http://${conf.hostname}:${conf.port}`;
	console.info(`Server running at ${chalk.green(addr)}`);
});
