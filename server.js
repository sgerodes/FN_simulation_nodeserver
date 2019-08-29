const http = require('http');
const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
		let body = '';
		console.log('--------------------------------BEGIN OF REQUEST--------------------------------');
		console.log(JSON.stringify(req.headers));
		req.on('data', chunk => {
			body += chunk.toString();
		});
		req.on('end', () => {
			console.log(body);
			console.log('--------------------------------END OF REQUEST--------------------------------');
			res.end('ok');
		});
    }
    else {
      res.end('All good');
    }
});
server.listen(9999);