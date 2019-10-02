var express = require('express');
var router = express.Router();
var main_page = require('./main_page');

var firebase = require('firebase');
firebase.initializeApp(require('../firebaseconfig.json'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NTU Learning Platform'});
});

/* Use this route to make testing /main easier */
router.get('/main', function(req, res, next) {
  console.log('Logging in via GET');
  res.render('main_page', { title: 'Main Page', matric_id: 'Developer' });
})

router.post('/main', function(req, res, next) {
  console.log('Logging in via POST');

  var details = firebase.database().ref('/Users');
       
  res.render('main_page', { title: 'Main Page', username: req.body.username });
});

module.exports = router;
