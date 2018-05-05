var express = require('express');
var router = express.Router();
var fs = require('fs');
var fileController = require('../controllers/FileController');
var formidable = require('formidable'),
  http = require('http'),
  util = require('util');

router.post('/upload', function(req, res){
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    // parse a file upload
    var form = new formidable.IncomingForm();

    //Sets the directory for placing file uploads in  You can move them later on using fs.rename(). The default is os.tmpdir().
    form.uploadDir = __dirname + "/../tmpUpload/";
    console.log(form.uploadDir);
    
    //include the extensions of the original file(s)
    form.type = true;

    //2MB size maximun of uploaded file
    form.maxFileSize = 2 * 1024 * 1024;
    
    form.multiples = true;

    form.parse(req, function (err, fields, files) {
      if(err) {
        console.log(err);
        res.writeHead(500, err);
        res.write(err.message);
        res.end();
        return ;
      }

      var callback = function(err){
        if(err) {
          res.writeHead(500, err);
          res.end(err);
        }
        //success -- upload
        res.json({'result':'success'});
      }
      
      //Store files to specific location indicated by users
      var pathStoredFolder = process.cwd() + '/public/folders/' + fields.selectedFolder + '/';
      if (files.upload instanceof (Array) ) {
        files.upload.forEach(function(element, index) {
          fs.rename(element.path, pathStoredFolder + (parseInt(Math.random()*1000)) + element.name, function(err){
            if(err) {
              console.log(err);
              callback(err);
              return ;
            }
            if(index == files.upload.length - 1) {
              callback(null);
            }
          });
        });
      } else {
        //files.upload
        fs.rename(files.upload.path, pathStoredFolder + (parseInt(Math.random() * 1000)) + files.upload.name, function (err) {
          if (err) {
            console.log(err);
            callback(err);
            return;
          }
          callback(null);
        });
      }
    });
  }
});

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
