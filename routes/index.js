var express = require('express');
var router = express.Router();
var fs = require('fs');
var fileController = require('../controllers/FileController');

router.get('/upload', function(req, res) {
  //get options
  fileController.readFiles(process.cwd() + '/public/folders/', 'dir', function(err, files){
    if(err) {
      throw err;
      return;
    }

    res.render('upload', {'selections' : files});
  });
});

function generatePathsArray(req){
  if(req.originalUrl == '/') {
    return ['/'];
  }
  var array = req.originalUrl.split('/');
  var pathStr = '';
  if (array.length > 1) {
    var tempArray = [];
    pathStr += '/';
    tempArray.push(pathStr);
    for(var i = 1; i < array.length; i++) {
      pathStr += array[i];
      tempArray.push(pathStr);
      pathStr += '/';
    }
    array = tempArray;
    return array;
  }
  return array;
}

router.use('/:folderName', function (req, res, next) {
  ////get dirctories
  var folderName = req.params.folderName;
  var folders = [];
  console.log(req.baseUrl);
  console.log(req.originalUrl);
  console.log(req.url);
  var callback = function (err, files) {
    if (err) {
      next();
      return;
    }
    var array = generatePathsArray(req);
    var pathsNames = ['Home'].concat(req.originalUrl.split('/').slice(1));
    res.render('index', { folders: files, currentDir: req.originalUrl, pathsArray: array, pathsName: pathsNames});
  }
  var pathDir = `${process.cwd()}/public/folders${req.originalUrl}/`;
  fileController.readFiles(pathDir, '*', callback);
});


/* GET home page. */
router.get('/', function (req, res, next) {
  ////get dirctories
  var folders = [];
  var callback = function (err, files) {
    if (err){
      next();
      return;
    }  
    var array = generatePathsArray(req);
    var pathsNames = ['Home'];
    res.render('index', { folders: files, currentDir: req.originalUrl, pathsArray: array, pathsName: pathsNames });
    // res.render('index', { folders: files, currentDir: req.originalUrl, pathsArray: array, pathsName: array });
  }
  fileController.readFiles(process.cwd() + '/public/folders/', 'dir', callback);
});

router.get('/upload', function (req, res) {
  res.render('upload');
});

module.exports = router;
