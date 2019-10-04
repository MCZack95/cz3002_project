var express = require('express');
var router = express.Router();
var main_page = require('./main_page');
var thread = require('./thread');

var firebase = require('firebase');
firebase.initializeApp(require('../firebaseconfig.json'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NTU Learning Platform'});
});

/* Use this route to make testing /main easier */
router.get('/main', function(req, res, next) {  
  Promise.resolve(main_page.getForumData()).then(function(data){
    res.render('main_page', { title: 'Main Page', username: 'Developer', data: data });
  });
});

router.post('/main', function(req, res, next) {
  console.log('Logging in via POST');

  details_dict = {}

  var details = firebase.database().ref('/users');

  details.on('value',
  function(snapshot) {
    details_dict = snapshot.val()
    // console.log(snapshot.val());
  }
  )

  setTimeout(function() { 
    console.log('details_dict: ' + JSON.stringify(details_dict));
  }, 1500);
  
  test_obj = [{'t_id':'1', 'title': 'ASE', 'tags': 'abc', 'numOfReplies': 123, 'rating': 4},
              {'t_id':'3', 'title': 'ABC', 'tags': 'efg', 'numOfReplies': 456, 'rating': 9}];

  Object.keys(details_dict).forEach(function(key) {
    if (req.body.username === details_dict[key]['username'] && req.body.password === details_dict[key]['password']) {
      res.render('main_page', { title: 'Main Page', username: req.body.username, data: test_obj });
    }
  });

  res.redirect('/');
  
  // if (req.body.username in details_dict && details_dict[req.body.username] == req.body.password) {
  //   res.render('main_page', { title: 'Main Page', username: req.body.username });
  // } else {
  //   res.redirect('/');
  // }

});

// Use this url to test
router.get('/thread', function(req, res, next) {
  Promise.resolve(thread.get_thread_replies(0)).then(function(data){
    Promise.resolve(thread.get_thread_size(0)).then(function(thread_size){
      res.render('thread', { title: 'Developer Thread', data: data, thread_size: thread_size });
    });
  });
});

router.post('/main/:thread_id', function(req, res, next){
  Promise.resolve(thread.get_thread_replies(req.body.id)).then(function(data){
    Promise.resolve(thread.get_thread_size(req.body.id)).then(function(thread_size){
      res.render('thread', { title: req.body.title, data: data, thread_size: thread_size });
    });
  });
});

module.exports = router;
