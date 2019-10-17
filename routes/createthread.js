var express = require('express');
var router = express.Router();
var main_page = require('./main_page');
var firebase = require('firebase');

router.get('/', function(req, res, next) {
    res.render('createthread');
});

router.post('/newthread', function(req, res, next) {

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
    username : req.body.username,
    content : req.body.content,
    dateTime : Date.now(),
    noOfLikes : 0,
    noOfVotes : 0,
    replyTo : " ",
  }

  var newThreadindex =  noOfThreads +1;
  console.log("New Thread ID : " + newThreadindex);
  details.child(req.body.coursecode+"Thread"+(newThreadindex)).child("Post1").set(newThread);
  // Post 1 cause create thread always is first post
  
  var details = firebase.database().ref('/'+req.body.coursecode+"/threads/"+req.body.coursecode+"Thread"+ newThreadindex);
  details.child("title").set(req.body.title);

  console.log('hi'+req.body.coursecode);

  // can change this to directly to the new thread
  res.redirect('/createthread');
});

module.exports = router;