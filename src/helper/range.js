module.exports = (totalSize, req, res) =>{
	const range = req.headers['range'] || '';
	if(!range){
		return { code: 200 };
	}
	const sizes = range.match(/bytes=(\d*)-(\d*)/);
	const end = sizes ? parseInt(sizes[2]) : totalSize - 1;
	const start = sizes ? parseInt(sizes[1]) : 0;

	res.setHeader('Accept-Ranges', 'bytes');
	res.setHeader('Content-Range', `bytes= ${start}-${end}/${totalSize}`);
	res.setHeader('Content-Length', end - start);

	if(start > end || start < 0 || end > totalSize){
		return { code: 416 };
	}

	return {
		code: 206,
		start,
		end
	};
};
