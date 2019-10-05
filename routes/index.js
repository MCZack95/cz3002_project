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
  res.render('main_page', { title: 'Main Page', username: 'Developer', data: main_page.get_all_forum_data() });
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

  Object.keys(details_dict).forEach(function(key) {
    if (req.body.username === details_dict[key]['username'] && req.body.password === details_dict[key]['password']) {
      res.render('main_page', { title: 'Main Page', username: req.body.username, data: main_page.get_all_forum_data() });
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

  details_dict = {}

  var details = firebase.database().ref('/'+req.body.coursecode+"/threads");
  //console.log(req.body.coursecode);
  details.on('value',
  function(snapshot) {
    details_dict = snapshot.val()
    console.log(snapshot.val());
  }
  )
  var noOfThreads = Object.keys(details_dict).length

  console.log("Number of Threads : " + noOfThreads);

  
  var newThread =
  {
    id : 1,
    username : "Username",
    content : req.body.content,
    dateTime : Date.now(),
    noOfLikes : 0,
    noOfVotes : 0,
    replyTo : " ",
  }

  var newThreadindex =  noOfThreads +1;
  console.log("New Thread ID : " + newThreadindex);
  details.child("Thread"+(newThreadindex)).child("Post1").set(newThread);
  // Post 1 cause create thread always is first post
  
  var details = firebase.database().ref('/'+req.body.coursecode+"/threads/Thread"+ newThreadindex);
  details.child("Title").set(req.body.title);


  res.render('main_page', { title: 'Main Page', username: req.body.username, data: main_page.get_all_forum_data() });
  
});

// Use this url to test
router.get('/thread', function(req, res, next) {
  res.render('thread', { title: 'Developer Thread', data: thread.get_thread_replies(0), thread_size: thread.get_thread_size(0) });
});

router.post('/main/:thread_id', function(req, res, next){
  res.render('thread', { title: req.body.title, data: thread.get_thread_replies(req.body.id), thread_size: thread.get_thread_size(req.body.id) });
});

module.exports = router;
