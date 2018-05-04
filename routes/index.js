var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/upload', function(req, res) {

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
  console.log(pathDir);
  fs.readdir(pathDir, function (err, files) {
    if (err) {
     next();
     return;
    }
    if(files.length == 0) {
      callback(null, folders);
    }
    files.forEach(function (file, index) {
      fs.stat(pathDir + file, function (err, stats) {
        if (err) {
          next();
          return;
        }
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


/* GET home page. */
router.get('/', function (req, res, next) {
  ////get dirctories
  var folders = [];
  var callback = function (err, files) {
    if (err)
      throw err;
    var array = generatePathsArray(req);
    var pathsNames = ['Home'];
    res.render('index', { folders: files, currentDir: req.originalUrl, pathsArray: array, pathsName: pathsNames });
    // res.render('index', { folders: files, currentDir: req.originalUrl, pathsArray: array, pathsName: array });
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
