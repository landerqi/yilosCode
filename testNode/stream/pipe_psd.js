const fs = require('fs');

fs.createReadStream('1.psd').pipe(fs.createWriteStream('1-pipe.psd'));
