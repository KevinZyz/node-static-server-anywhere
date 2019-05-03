const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const Handlebars = require('handlebars');

const mime = require('./mime');
const compress = require('./compress');


const source = fs.readFileSync(path.join(__dirname, '../template/dir.html'));
const template = Handlebars.compile(source.toString());

module.exports = async (req, res, filePath, config) => {
	try{
		const stats = await stat(filePath);
		if(stats.isFile()){
			const contentType = mime(filePath);
			res.setStatusCode = 200;
			res.setHeader('Content-Type', contentType);
			let rs = fs.createReadStream(filePath);
			if(filePath.match(config.compress)){
				rs = compress(rs, req, res);
			}
			rs.pipe(res);
		} else if(stats.isDirectory()){
			const files = await readdir(filePath);
			const dir = path.relative(config.root, filePath);
			const data = {
				files,
				dir: dir ? `/${dir}` : ''
			};
			res.end(template(data));
		}
	}catch(ex){
		res.setStatusCode = 404;
		res.setHeader('Content-Type', 'text/plain');
		res.end(`${filePath} is not a directory or file`);
	}
};
