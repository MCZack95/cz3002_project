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
  console.log('Getting Main Page');

  details_dict = {}

  var details = firebase.database().ref('/users');

  details.on('value',
  function(snapshot) {
    details_dict = snapshot.val()
    // console.log(snapshot.val());
  }
  )


  res.render('main_page', { title: 'Main Page', username: 'Developer', data: main_page.get_all_forum_data() });
});

router.post('/main', function(req, res, next) {
  console.log('Logging in via POST');

  details_dict = {}
  thread_dict1 = {}
  thread_dict2 = {}
  thread_dict3 = {}
  finalthread_dict = {}
  tmpthread_dict = {}

  var details = firebase.database().ref('/users');
  details.on('value',
  function(snapshot) {
    details_dict = snapshot.val()
    // console.log(snapshot.val());
  }
  )

  var threaddetails1 = firebase.database().ref('CZ3002/threads');
  var threaddetails2 = firebase.database().ref('CZ3003/threads');
  var threaddetails3 = firebase.database().ref('CZ4047/threads');

//Get threads in each course code
  threaddetails1.on('value',
  function(snapshot) {
    thread_dict1 = snapshot.val()
    console.log("CZ3002 Threads : " + JSON.stringify(snapshot.val()));
  })

  threaddetails2.on('value',
  function(snapshot) {
    thread_dict2 = snapshot.val()
    console.log("CZ3003 Threads : " + JSON.stringify(snapshot.val()));
  })

  threaddetails3.on('value',
  function(snapshot) {
    thread_dict3 = snapshot.val()
    console.log("CZ4047 Threads : " + JSON.stringify(snapshot.val()));
  })

  tmpthread_dict = Object.assign({}, thread_dict1, thread_dict2);
  finalthread_dict = Object.assign({}, thread_dict3,tmpthread_dict);
  console.log("Final Threads : " + JSON.stringify(finalthread_dict));

  setTimeout(function() { 
    console.log('details_dict: ' + JSON.stringify(details_dict));
  }, 1500);

  Object.keys(details_dict).forEach(function(key) {
    if (req.body.username === details_dict[key]['username'] && req.body.password === details_dict[key]['password']) {
      res.render('main_page', { title: 'Main Page', username: req.body.username, data: finalthread_dict });
    }
  });

  res.redirect('/');
  
  // if (req.body.username in details_dict && details_dict[req.body.username] == req.body.password) {
  //   res.render('main_page', { title: 'Main Page', username: req.body.username });
  // } else {
  //   res.redirect('/');
  // }

});

//post to create Thread
router.post('/createthread', function(req, res, next) {
  console.log('Creating a Thread');
  res.render('createthread');
});

// Use this url to test
router.get('/thread', function(req, res, next) {
  res.render('thread', { title: 'Developer Thread', data: thread.get_thread_replies(0), thread_size: thread.get_thread_size(0) });
});

router.post('/main/:thread_id', function(req, res, next){
  res.render('thread', { title: req.body.title, data: thread.get_thread_replies(req.body.id), thread_size: thread.get_thread_size(req.body.id) });
});

module.exports = router;
