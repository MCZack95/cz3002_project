var express = require('express');
var router = express.Router();
var login = require('./main_page');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NTU Learning Platform', username: ''});
});

router.post('/main', function(req, res, next) {
  console.log('Post!!');
  res.render('main_page', { title: 'Main Page', matric_id: req.body.matric_id });
});

module.exports = router;
