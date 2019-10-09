var express = require('express');
var router = express.Router();
var main_page = require('./main_page');
var thread = require('./thread');

var firebase = require('firebase');
firebase.initializeApp(require('../firebaseconfig.json'));

var username = "";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NTU Learning Platform'});
});

/* Use this route to make testing /main easier */
router.get('/main', function(req, res, next) {  
  console.log('Getting Main Page');

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

  res.render('main_page', { title: 'Main Page', username: username, data: finalthread_dict });
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
      username = req.body.username;
      res.render('main_page', { title: 'Main Page', username: req.body.username, data: finalthread_dict });
    }
  });

  const courseArray = main_page.UniqueCourse(req.body.username);
  console.log(courseArray);

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

//post to view quiz score
router.post('/quizscore', function(req, res, next) {
  console.log(req.body.testing);
  var cc = req.body.coursecode;
  var quizno = req.body.quizno;
  var details_dict = {};
  //fetch answers
  var details = firebase.database().ref('/'+ cc + "/quizzes/" +quizno);
  var title;

  details.on('value',
  function(snapshot) {
    details_dict = snapshot.val();
    console.log(snapshot.val());
    title = details_dict.Title;
  })
  console.log(title);
  delete details_dict.Title;

  //get actual answers in an array
  var answerkey = [];
  for(var x=0;x<Object.keys(details_dict).length;x++){
    answer[x] = details_dict["Question" + (x+1)]["answer"];
  }

  console.log("LOL " + answerkey);

  //store user's answers in an array 
  var answer = [];
  for(var x=0;x<req.body.testing;x++){
    answer[x] = req.body["q" + (x+1)];
  }

  console.log("AAA " + answer);

  res.render('quizscore', {answers: answer, details: details_dict, title: title});
});

//post to view quiz
router.post('/viewquiz', function(req, res, next) {

  var details_dict = {};
  var coursecode = "CZ4047";
  var quizno = "Quiz5";
  var details = firebase.database().ref('/'+ coursecode + "/quizzes/" +quizno);
  var title;
  var score = 0;

  details.on('value',
  function(snapshot) {
    details_dict = snapshot.val();
    console.log(snapshot.val());
    title = details_dict.Title;
  })
  
  delete details_dict.Title;
  console.log(details_dict);
  res.render('attemptquiz', { quiz: details_dict, title: title, coursecode: coursecode, quizno: quizno});
});

//thread methods
router.post('/votepost', function(req, res, next) {
  console.log('Voting test');
  var coursecode = "CZ4047";
  var threadno = "Thread1";
  var postno = "Post1";
  var votes;

  details_dict = {}

  var details = firebase.database().ref('/'+ coursecode + "/threads/" + coursecode+threadno + "/" + postno);
  //console.log(req.body.coursecode);
  details.on('value',
  function(snapshot) {
    details_dict = snapshot.val();
    console.log(snapshot.val());
    votes = details_dict["noOfVotes"];
    //add logic to decide + or -
    votes += 1;
    details.child("noOfVotes").set(votes);

  }
  )

  res.render('createquiz');

});

router.post('/votepost', function(req, res, next) {
  console.log('Voting test');
  var coursecode = "CZ4047";
  var threadno = "Thread1";
  var postno = "Post1";
  var votes

  details_dict = {}

  var details = firebase.database().ref('/'+ coursecode + "/threads/" + coursecode+threadno + "/" + postno);
  //console.log(req.body.coursecode);
  details.on('value',
  function(snapshot) {
    details_dict = snapshot.val();
    console.log(snapshot.val());
    votes = details_dict["noOfVotes"];
    //add logic to decide + or -
    votes += 1;
    details.child("noOfVotes").set(votes);

  }
  )

  res.render('createquiz');

});

router.post('/votepost', function(req, res, next) {
  console.log('Voting test');
  var coursecode = "CZ4047";
  var threadno = "Thread1";
  var postno = "Post1";
  var votes;

  details_dict = {}

  var details = firebase.database().ref('/'+ coursecode + "/threads/" + coursecode+threadno + "/" + postno);
  //console.log(req.body.coursecode);
  details.on('value',
  function(snapshot) {
    details_dict = snapshot.val();
    console.log(snapshot.val());
    votes = details_dict["noOfVotes"];
    //add logic to decide + or -
    votes += 1;
    details.child("noOfVotes").set(votes);

  }
  )

  res.render('createquiz');

});

router.post('/editpost', function(req, res, next) {
  console.log('Editing test');
  var coursecode = "CZ4047";
  var threadno = "Thread1";
  var postno = "Post1";
  var content = "New content here."

  details_dict = {}

  var details = firebase.database().ref('/'+ coursecode + "/threads/" + coursecode+threadno + "/" + postno);
  //console.log(req.body.coursecode);
  details.on('value',
  function(snapshot) {
    details_dict = snapshot.val();
    console.log(snapshot.val());
    //push new content to DB
    details.child("content").set(content);
    details.child("dateTime").set(Date.now());

  }
  )

  res.render('createquiz');

});

router.post('/deletepost', function(req, res, next) {
  console.log('Deleting test');
  var coursecode = "CZ4047";
  var threadno = "Thread1";
  var postno = "Post2";

  details_dict = {}

  var details = firebase.database().ref('/'+ coursecode + "/threads/" + coursecode+threadno + "/" + postno);
  //console.log(req.body.coursecode);
  details.on('value',
  function(snapshot) {
    details_dict = snapshot.val();
    console.log(snapshot.val());
    //push new content to DB
    details.remove();
  }
  )

  res.render('createquiz');

});

router.post('/makepost', function(req, res, next) {
  console.log('Create post test');
  var coursecode = "CZ4047";
  var threadno = "Thread1";
  
  details_dict = {};

  var details = firebase.database().ref('/'+coursecode+"/threads/"+coursecode+threadno);
 
  details.orderByKey().startAt("Post").endAt("Post"+"\uf8ff").once('value',
  function(snapshot) {
    details_dict = snapshot.val()
    console.log(snapshot.val());
    var noOfPosts = Object.keys(details_dict).length;
    var newpostno = noOfPosts + 1;

    var newPost =
    {
      id : noOfPosts + 1,
      username : "Username",
      content : "New Post Content",
      dateTime : Date.now(),
      noOfLikes : 0,
      noOfVotes : 0,
      replyTo : " ",
    }
    details.child("Post" + newpostno).set(newPost);

  res.render('createquiz');

});

})

// Use this url to test
router.get('/thread', function(req, res, next) {
  res.render('thread', { title: 'Developer Thread', data: thread.get_thread_replies(0), thread_size: thread.get_thread_size(0) });
});

router.post('/main/:thread_id', function(req, res, next){
  
  details_dict = {};

  var details = firebase.database().ref('/'+req.body.coursecode+'/threads/'+req.body.coursecode +'Thread'+req.body.id.charAt(0));
  details.orderByKey().startAt("Post").endAt("Post"+"\uf8ff").on('value',
  function(snapshot) {
    details_dict = snapshot.val()
    console.log("Thread ID : "+ req.body.id + " /n "+ JSON.stringify(snapshot.val()));
  });
  
  console.log("Course code is " + req.body.coursecode + " ID : " + req.body.id);


  res.render('thread', { title: req.body.title, data: details_dict, thread_size: thread.get_thread_size(req.body.id) });
});

module.exports = router;
