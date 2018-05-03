var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  ////get dirctories
  
  res.render('index');
});

router.get('/upload', function(req, res){
  res.render('upload');
});

module.exports = router;
