var express = require('express');
var router = express.Router();
var main_page = require('./main_page');

var firebase = require('firebase');
firebase.initializeApp(require('../firebaseconfig.json'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NTU Learning Platform', username: ''});
});

/* Use this route to make testing /main easier */
router.get('/main', function(req, res, next) {
  console.log('Logging in via GET');

  Promise.resolve(main_page.getForumData()).then(function(data){
    console.log(data);
    res.render('main_page', { title: 'Main Page', matric_id: 'Developer', data: data });
  });
})

router.post('/main', function(req, res, next) {
  console.log('Logging in via POST');
  res.render('main_page', { title: 'Main Page', matric_id: req.body.matric_id });
});

module.exports = router;
