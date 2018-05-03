var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
  ////get dirctories
  //var folderName = req.params.folderName;
  var folders = [];
  var callback = function (err, files) {
    if (err)
      throw err;
    res.render('index', { folders: files });
  }
  console.log(process.cwd());
  fs.readdir(process.cwd() + '/public/folders/', function (err, files) {
    if (err)
      throw err;
    files.forEach(function (file, index) {
      fs.stat(process.cwd() + '/public/folders/' + file, function (err, stats) {
        if (err)
          throw err;
        if (stats.isDirectory) {
          folders.push(file);
          console.log(folders);
        }
        if (files.length == index + 1) {
          callback(null, folders);
        }
      });
    })
  });
});

router.get('/upload', function (req, res) {
  res.render('upload');
});

module.exports = router;
