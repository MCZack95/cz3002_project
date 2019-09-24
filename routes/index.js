var express = require('express');
var router = express.Router();
var signup = require('./signup');
var login = require('./login');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NTU Learning Platform', username: ''});
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Sign Up Page'});
});

router.post('/signup', function(req, res, next) {
  console.log(req.body.username);
  res.render('index', { title: 'NTU Learning Platform', username: req.body.username });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Main Page'});
});

module.exports = router;
