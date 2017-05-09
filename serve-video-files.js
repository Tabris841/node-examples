var fs = require('fs');
var http = require('http');

var server = http.createServer();
server.on('request', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'video/mp4'
    });
    var rs = fs.createReadStream('./rxjs.mp4');
    rs.pipe(res);
});

server.listen(3000);