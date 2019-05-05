const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const Handlebars = require('handlebars');

const mime = require('./mime');
const compress = require('./compress');
const range = require('./range');
const isCached = require('./cache');


const source = fs.readFileSync(path.join(__dirname, '../template/dir.html'));
const template = Handlebars.compile(source.toString());

module.exports = async (req, res, filePath, config) => {
	try{
		const stats = await stat(filePath);
		if(stats.isFile()){
			const contentType = mime(filePath);
			res.setHeader('Content-Type', contentType);

			if(isCached(stats, req, res)){
				res.statusCode = 304;
				res.end();
				return ;
			}

			let rs;
			const { code, start, end } = range(stats.size, req, res);
			res.statusCode = code;
			if(code === 200){
				rs = fs.createReadStream(filePath);
			}else{
				rs = fs.createReadStream(filePath, {start, end});
			}

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
		res.statusCode = 404;
		res.setHeader('Content-Type', 'text/plain');
		res.end(`${filePath} is not a directory or file`);
	}
};
