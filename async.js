var async = require('async');
var request = require('request');

var port = process.argv[2] && parseInt(process.argv[2], 10) || 8080;
require('http').createServer(function (req, res) {
    var body = '';
    req.setEncoding('utf8');
    req.on('data', function (data) {
        body += data;
    });
    req.once('end', function () {
        var number = JSON.parse(body);
        var squared = Math.pow(number, 2);
        res.end(JSON.stringify(squared));
    });
}).listen(port, function () {
    console.log('Squaring Server listening on port %d', port);
});


function done(err, results, body) {
    if (err) {
        throw err;
    }
    console.log('results: %j', results, body);
}

/**
 * Executing in Parallel
 */
async.series([

    function (next) {
        request.post({
                uri: 'http://localhost:8080',
                body: '4'
            },
            function (err, res, body) {
                next(err, body && JSON.parse(body));
            }
        )
    },

    function (next) {
        request.post({
            uri: 'http://localhost:8080',
            body: '5'
        }, function (err, res, body) {
            next(err, body && JSON.parse(body));
        });
    }
], done);

/**
 * Cascading
 */
// async.waterfall([
//     function (next) {
//         request.post({
//             uri: 'http://localhost:8080',
//             body: "3"
//         }, next)
//     },
//     function (res, body, next) {
//         request.post({
//             uri: 'http://localhost:8080',
//             body: body
//         }, next);
//     }
// ], done);

/**
 * Queuing
 */
// var maximumConcurrency = 5;

// function worker(task, callback) {
//     request.post({
//         uri: 'http://localhost:8080',
//         body: JSON.stringify(task)
//     }, function (err, res, body) {
//         callback(err, body && JSON.parse(body));
//     });
// }

// var queue = async.queue(worker, maximumConcurrency);
// queue.concurrency = 10;
// queue.saturated = function () {
//     console.log('queue is saturated');
// };
// queue.empty = function () {
//     console.log('queue is empty');
// };
// queue.drain = function () {
//     console.log('queue is drained, no more work!');
// };

// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(function (i) {
//     queue.push(i, function (err, result) {
//         if (err) {
//             throw err;
//         }
//         console.log(i + '^2 = %d', result);
//     });
// });

/**
 * Iterating
 */
// var results = {};
// var collection = [1, 2, 3, 4];

// function done(err) {
//     if (err) {
//         throw err;
//     }
//     console.log('done! results: %j', results);
// }

// function iterator(value, callback) {
//     request.post({
//             uri: 'http://localhost:8080',
//             body: JSON.stringify(value)
//         },
//         function (err, res, body) {
//             if (err) {
//                 return callback(err);
//             }
//             results[value] = JSON.parse(body);
//             callback();
//         });
// }
// async.forEach(collection, iterator, done);
// async.forEachSeries(collection, iterator, done);
// var maximumConcurrency = 5;
// async.forEachLimit(collection, maximumConcurrency, iterator, done);

/**
 * Mapping
 */

// var collection = [1, 2, 3, 4];

// function done(err, results) {
//     if (err) {
//         throw err;
//     }
//     console.log('done! results: %j', results);
// }

// function iterator(value, callback) {
//     request.post({
//             uri: 'http://localhost:8080',
//             body: JSON.stringify(value)
//         },
//         function (err, res, body) {
//             callback(err, body && JSON.parse(body));
//         });
// }
// async.map(collection, iterator, done);

/**
 * Reducing
 */
// var collection = [1, 2, 3, 4];

// function done(err, result) {
//     if (err) {
//         throw err;
//     }
//     console.log('The sum of the squares of %j is %d', collection, result);
// }

// function iterator(memo, item, callback) {
//     request.post({
//             uri: 'http://localhost:8080',
//             body: JSON.stringify(item)
//         },
//         function (err, res, body) {
//             callback(err, body && (memo + JSON.parse(body)));
//         });
// }
// async.reduce(collection, 0, iterator, done);

/**
 * Filtering
 */
// var collection = [1, 2, 3, 4, 5];

// function done(results) {
//     console.log('These are the elements of %j whose ' + 'square value is greater than 10: %j', collection, results);
// }

// function test(value) {
//     return value > 10;
// }

// function filter(item, callback) {
//     request.post({
//             uri: 'http://localhost:8080',
//             body: JSON.stringify(item)
//         },
//         function (err, res, body) {
//             if (err) {
//                 throw err;
//             }
//             callback(body && test(JSON.parse(body)));
//         });
// }
// async.filter(collection, filter, done);

/**
 * Detecting
 */
// var collection = [1, 2, 3, 4, 5];

// function done(result) {
//     console.log('The first element on %j whose square value ' + 'is greater than 10: %j', collection, result);
// }

// function test(value) {
//     return value > 10;
// }

// function detect(item, callback) {
//     request.post({
//             uri: 'http://localhost:8080',
//             body: JSON.stringify(item)
//         },
//         function (err, res, body) {
//             if (err) {
//                 throw err;
//             }
//             callback(body && test(JSON.parse(body)));
//         });
// }
// async.detect(collection, detect, done)