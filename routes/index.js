var express = require('express');
var router = express.Router();
var main_page = require('./main_page');
var thread = require('./thread');
var db = require('./db');
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
  });

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
  
});

//post to create Thread
router.post('/createthread', function(req, res, next) {
  console.log('Creating a Thread');
  res.render('createthread');
});

//post to create Quiz
router.post('/createquiz', function(req, res, next) {
  console.log('Creating a Quiz');
  res.render('createquiz');
});

//post to view quiz
router.post('/viewquiz', function(req, res, next) {

  var details_dict = {};
  var coursecode = "CZ4047";
  var quizno = "Quiz1";
  var details = firebase.database().ref('/'+ coursecode + "/quizzes/" +quizno);
  var title;

  details.on('value',
  function(snapshot) {
    details_dict = snapshot.val();
    console.log(snapshot.val());
    title = details_dict.Title;
  })
  
  delete details_dict.Title;
  console.log(details_dict);
  res.render('attemptquiz', { quiz: details_dict, title: title});
});

//up vote and down vote

router.post('/votepost', function(req, res, next) {

  var coursecode = "CZ"+req.body.threadid.split("CZ")[1]
  var threadid = req.body.threadid.split("CZ")[0];
  var postid = req.body.votebutton.split(";")[0];
  var IsVote = req.body.votebutton.split(";")[1];
  db.votePost(coursecode,threadid,postid,IsVote);
  
  //need to know how to refresh the page with new data
  res.render('createquiz');
});
//edit a particular post

router.post('/editpost', function(req, res, next) {
  
  console.log('Editing Post');

  //need to add dynamic inputs from pug form
  var coursecode = "CZ4047";
  var threadid = "Thread1";
  var postid = "Post1";
  var content = "New content here."
  db.editPost(coursecode,threadid,postid,content);

  //need to know how to refresh the page with new data
  res.render('createquiz');

});
//delete a post

router.post('/deletepost', function(req, res, next) {
  // Can add in logic to check if post belongs to user before deleting and sending res back to front end
  console.log('Deleting Post');
  var coursecode = "CZ4047";
  var threadid = "Thread1";
  var postid = "Post2";
  db.deletePost(coursecode,threadid,postid);

  //need to know how to refresh the page wih new data
  res.render('createquiz');

});

//create a post

router.post('/makepost', function(req, res, next) {
  console.log('Create post test');
  var coursecode = "CZ4047";
  var threadno = "Thread1";

  
  /** Need to pass in dynamic form data from pug
  var newPost =
    {
      id : " ",
      username : req.body.username,
      content : req.body.content,
      dateTime : Date.now(),
      noOfVotes : 0,
      replyTo : "",
    }
  **/

  db.makePost(coursecode,threadno,newPost);
  //need to know how to refresh the page with new data
  res.render('createquiz');


})

// Use this url to test
router.get('/thread', function(req, res, next) {
  res.render('thread', { title: 'Developer Thread', data: thread.get_thread_replies(0), thread_size: thread.get_thread_size(0) });
});


// Post and Get Method for displaying of Posts on particular thread
router.post('/main/:thread_id', function(req, res, next){
  
  details_dict = {};
  details_dict = db.getAllPosts(req.body.coursecode,req.body.id);

  res.render('thread', { title: req.body.title, data: details_dict, threadid: req.body.id });
});

router.get('/main/:thread_id', function(req, res, next){
  
  details_dict = {};
  details_dict = db.getAllPosts(req.body.coursecode,req.body.id);
  
  res.render('thread', { title: req.body.title, data: details_dict, threadid: req.body.id });
});

module.exports = router;
