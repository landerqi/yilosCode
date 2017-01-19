const fs = require('fs');

let readStream = fs.createReadStream('1.psd');
let writeSteam = fs.createWriteStream('1-stream.psd');

readStream.on('data', function(chunk) {
	if (writeSteam.write(chunk) === false) {
		console.log('still cached');
		readStream.pause();
	}
})

readStream.on('end', function() {
	writeSteam.end();
})

writeSteam.on('drain', function() {
	console.log('data drains');
	readStream.resume();
})
