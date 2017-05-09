var http = require('http').createServer(handler);
var io = require('socket.io').listen(http);
var fs = require('fs');
var adapter = require('socket.io-redis');

var redisPort = 6379;
var redisHostname = '127.0.0.1';

var redis = require('redis'),
    pub = redis.createClient(redisPort, redisHostname),
    sub = redis.createClient(redisPort, redisHostname),
    client = redis.createClient(redisPort, redisHostname);

io.adapter(adapter({
    redisPub: pub,
    redisSub: sub,
    redisClient: client
}));

http.listen(4000);

function handler(req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data);
    });
}

var chat = io.of('/chat');

chat.on('connection', function (socket) {
    socket.on('clientMessage', function (message) {
        socket.emit('serverMessage', 'You said: ' + message);
        if (socket.room) {
            socket.broadcast.to(socket.room);
        }
        socket.broadcast.emit('serverMessage', socket.username + ' said: ' + message);
    });
    socket.on('login', function (username) {
        if (username) {
            socket.username = username;
        } else {
            socket.username = socket.id;
        }
        socket.room = socket.rooms[0];
        socket.emit('serverMessage', 'Currently logged in as ' + socket.username);
        socket.broadcast.emit('serverMessage', 'User ' + socket.username + ' logged in');

    });
    socket.on('disconnect', function () {
        socket.broadcast.emit('serverMessage', 'User ' + socket.username + ' disconnected');
    });
    socket.on('join', function (room) {
        if (socket.room) {
            socket.leave(socket.room);
            socket.broadcast.emit('serverMessage', 'User ' + socket.username + ' leave channel');
        }
        socket.room = room;
        socket.join(room);
        socket.emit('serverMessage', 'You joined room ' + room);
        socket.broadcast.to(room).emit('serverMessage', 'User ' + socket.username + ' joined this room');
    });

    socket.emit('login');
});