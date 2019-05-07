const http = require('http');
const path = require('path');
const chalk = require('chalk');
const conf = require('./config/defaultConfig');
const route = require('./helper/route');
const openUrl = require('./helper/openUrl');

class Server{
	constructor(config){
		this.conf = Object.assign({}, conf, config);
	}

	start() {
		const Server = http.createServer(async (req, res) => {
			const filePath = path.join(this.conf.root, req.url);
			route(req, res, filePath, this.conf);
		});

		Server.listen(this.conf.port, this.conf.hostname, () => {
			const addr = `http://${this.conf.hostname}:${this.conf.port}`;
			console.info(`Server running at ${chalk.green(addr)}`);
			openUrl(addr);
		});
	}
}

module.exports = Server;
