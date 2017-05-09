var express = require('express');
var fs = require('fs');
var multer = require('multer');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

var storage = multer.memoryStorage()
var upload = multer({
    storage: storage,
    dest: './uploads'
}).single('image');

router.post('/upload', upload, function (req, res) {
    var dirname = path.resolve(".") + '\\uploads\\'; // path.resolve(“.”) get application directory path
    var newPath = dirname + req.file.originalname.replace(" ", ""); // add the file name
    fs.writeFile(newPath, req.file.buffer, function (err) { // write file in uploads folder
        if (err) {
            res.json("Failed to upload your file");
        } else {
            res.json("Successfully uploaded your file");
        }
    });
});

router.get('/uploads/:file', function (req, res) {
    file = req.params.file;
    var dirname = path.resolve(".") + '\\upload\\';
    var img = fs.readFileSync(dirname + file);

    res.writeHead(200, {
        'Content-Type': 'image/jpg'
    });
    res.end(img, 'binary');
});

router.get('/download', function (req, res) { // create download route
    var dir = path.resolve(".") + '\\uploads\\'; // give path
    fs.readdir(dir, function (err, list) { // read directory return  error or list
        if (err) return res.json(err);
        else
            res.json(list);
    });
});

router.get('/:file(*)', function (req, res, next) { // this routes all types of file
    var file = req.params.file;
    var pathToFile = path.resolve(".") + '\\uploads\\' + file;
    res.download(pathToFile); // magic of download function
});

module.exports = router;