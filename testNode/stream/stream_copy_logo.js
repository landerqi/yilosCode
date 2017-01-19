const fs = require('fs');

let source = fs.readFileSync('../buffer/zhiniu_logo.png');

fs.writeFileSync('stream_copy_logo.png', source);
