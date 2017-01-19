const http = require('http');
const fs = require('fs');
const request = require('request');

const hostname = '127.0.0.1';
const port = 8090;

let server = http.createServer(function(req, res) {
		// fs.readFile('../buffer/zhiniu_logo.png', function(err, data) {
		// 	if (err) {
		// 		res.end('file not exist!');
		// 	} else {
		// 		res.writeHead(200, {'Context-Type': 'text/html'});
		// 		res.end(data);
		// 	}
		// })

		//fs.createReadStream('../buffer/zhiniu_logo.png').pipe(res);
		request('http://static.mukewang.com/static/img/common/logo.png').pipe(res);
	})

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
})
