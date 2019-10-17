var express = require('express');
var router = express.Router();
var main_page = require('./main_page');
var thread = require('./thread');
var db = require('./db');
var firebase = require('firebase');
var profile = require('./profile');
firebase.initializeApp(require('../firebaseconfig.json'));

var username = null;
var threadid = null;
var coursecode = null;
var title = null;
var role = null;

function isLoggedIn(req, res, next) {
  if(username == null) {
    console.log("User not logged in!")
    res.render("error404");
  } else {
    return next();
  };
};

/* GET home page. */
router.get('/', function(req, res, next) {
  username = null;
  res.render('index', { title: 'NTU Learning Platform'});
});

/* Use this route to make testing /main easier */
router.get('/main', isLoggedIn, function(req, res, next) {  
  console.log('Getting Main Page');
  console.log('username: ' + username);
  finalthread_dict = {}
  tmpthread_dict = {}

  courseArray = main_page.UniqueCourse(username);
  for (var x = 0; x < courseArray.length; x++){
    tmpthread_dict = db.getAllThreadsinOneCourse(courseArray[x]);
    finalthread_dict = Object.assign({}, finalthread_dict, tmpthread_dict);
  }

  res.render('main_page', { coursecode: courseArray, title: 'Main Page', username: username, data: finalthread_dict});
});

router.post('/main', function(req, res, next) {
  console.log('Logging in via POST');
  details_dict = {}
  thread_dict1 = {}
  thread_dict2 = {}
  thread_dict3 = {}
  finalthread_dict = {}
  tmpthread_dict = {}

  var threaddetails1 = firebase.database().ref('CZ3002/threads');
  var threaddetails2 = firebase.database().ref('CZ3003/threads');
  var threaddetails3 = firebase.database().ref('CZ4047/threads');

//Get threads in each course code
  threaddetails1.on('value',
  function(snapshot) {
    thread_dict1 = snapshot.val()
    // console.log("CZ3002 Threads : " + JSON.stringify(snapshot.val()));
  })

  threaddetails2.on('value',
  function(snapshot) {
    thread_dict2 = snapshot.val()
    // console.log("CZ3003 Threads : " + JSON.stringify(snapshot.val()));
  })

  threaddetails3.on('value',
  function(snapshot) {
    thread_dict3 = snapshot.val()
    // console.log("CZ4047 Threads : " + JSON.stringify(snapshot.val()));
  })

  var details = firebase.database().ref('/users');
  details.on('value',
  function(snapshot) {
    //tmpthread_dict = Object.assign({}, thread_dict1, thread_dict2);
    //finalthread_dict = Object.assign({}, thread_dict3,tmpthread_dict);
    console.log("Final Threads : " + JSON.stringify(finalthread_dict));

    setTimeout(function() { 
      // console.log('details_dict: ' + JSON.stringify(details_dict));
    }, 1500);

    var verified = false;
    
    details_dict = snapshot.val();
    // console.log(snapshot.val());
    Object.keys(details_dict).forEach(function(key) {
      if (req.body.username === details_dict[key]['username'] && req.body.password === details_dict[key]['password']) {
        username = req.body.username;
        verified = true;
        var courseArray = details_dict[key]['courses'].split(",");
        for (var x=0;x<courseArray.length;x++){
          switch (courseArray[x])
          {
            case "CZ3002":{
              finalthread_dict = Object.assign({}, finalthread_dict,thread_dict1);
              break;
            }
            case "CZ3003":{
              finalthread_dict = Object.assign({},finalthread_dict,thread_dict2);
              break;
            }
            case "CZ4047":{
              finalthread_dict = Object.assign({},finalthread_dict,thread_dict3);
              break;
            }
          }
        }
        console.log("Final Threads : " + JSON.stringify(finalthread_dict));
        console.log("CourseArray : " + courseArray);
        res.render('main_page', { coursecode: courseArray, title: 'Main Page', username: req.body.username, data: finalthread_dict });
      }
    });
  
    if (!verified) {
      res.redirect('/');
    }
  }); 
});

//post to create Thread can't shift cause button on main page so routing is index.js
router.post('/createthread', function(req, res, next) {
  console.log('Creating a Thread');
  res.render('createthread',{username : username});
});

//post to create Quiz can't shift cause button on main page so routing is index.js
router.post('/createquiz', function(req, res, next) {
  console.log('Creating a Quiz');
  res.render('createquiz');
});

//calendar test

router.get('/calendar', function(req, res, next) {
  setTimeout(function(){

    console.log("Getting calender ");
    var events = {"11/10/2019": ["test","damn","gg"]}; 
  
    var details_dict = {};
    var details = firebase.database().ref('/consultations/dates');
   
  
    details.once('value',
    function(snapshot) {
      details_dict = snapshot.val();
      console.log("\n");
      console.log(snapshot.val());
   
      console.log("ASGS: " + JSON.stringify(details_dict));
  
      if (username != null) {
        res.render('calendar', {dict: JSON.stringify(details_dict), user: username});
      } else {
        res.render('error404');
      }
    }) 


  },1000);
 
});

router.post('/calendar', function(req, res, next) {
  var events = {"11/10/2019": ["test","damn","gg"]}; 

  var details_dict = {};
  var details = firebase.database().ref('/consultations/dates');
  
  details.once('value',
  function(snapshot) {
    details_dict = snapshot.val();
    console.log("\n");
    console.log(snapshot.val());

  
    console.log("ASGS: " + JSON.stringify(details_dict));
    res.render('calendar', {dict: JSON.stringify(details_dict), testarr: ["lol","what"], user: username});   
  });
});

router.post('/bookcon', function(req, res, next) {

  var arr = req.body.dateno.split(" ");
  var dateno = arr[0];
  var conno = arr[1];
  console.log(dateno + " " + conno);
  var details = firebase.database().ref('/consultations/dates/' + dateno);
  details.once('value',
  function(snapshot) {
    details_dict = snapshot.val();
    console.log("BOOKCON\n");
    console.log(snapshot.val());
    var details = firebase.database().ref('/consultations/dates/' + dateno + '/' + conno);
    details.child("booked").set("1");
    details.child("bookedby").set(username);
  
    res.render('createquiz');
    
    
  })

});


//cancel consult
router.post('/cancelcon', function(req, res, next) {

  var arr = req.body.dateno1.split(" ");
  var dateno = arr[0];
  var conno = arr[1];
  console.log(dateno + " " + conno);
  var details = firebase.database().ref('/consultations/dates/' + dateno);
  details.once('value',
  function(snapshot) {
    details_dict = snapshot.val();
    console.log("CANCELCON\n" + req.body.dateno);
    //console.log(snapshot.val());
    var details = firebase.database().ref('/consultations/dates/' + dateno + '/' + conno);
    details.child("booked").set("0");
    details.child("bookedby").set(" ");

  
    res.render('createquiz');
    
    
  })

});

//calendar test
router.post('/setconsult', function(req, res, next) {
  console.log('SET!');
  var details_dict = {};
  var details = firebase.database().ref('/consultations/dates');
  var times = req.body.time.split(" ");
  var from = times[0];
  var to = times[1];

    details.once('value',
    function(snapshot) {
      console.log("start");
      details_dict = snapshot.val();
      var dateno = "";
      var conno = 0;

     
      for(var x in details_dict){

          console.log(details_dict[x]["date"]);
          if(req.body.datetoday==details_dict[x]["date"]){
            console.log("HIHIHIHI");
            dateno = x;
            console.log(dateno);
            conno = Object.keys(details_dict[x]).length;
            console.log(conno);
          }

      }

      var newConsult = 
      {
        prof: "Li Yi",
        timefrom: from,
        timeto: to,
        course: "CZ4047",
        booked: 0,
        bookedby: " ",
        
      }
      
      if(dateno!=""){
        //date exists set new con
        var details1 = firebase.database().ref('/consultations/dates/' + dateno);
        details1.child("con" + conno).set(newConsult);
        
        
      }else{

        //new date
        var newindex = Object.keys(details_dict).length + 1;
        var details2 = firebase.database().ref('/consultations/dates/date' + newindex + "/con1");
        details2.set(newConsult);
        var details2 = firebase.database().ref('/consultations/dates/date' + newindex);
        
        details2.child("date").set(req.body.datetoday);

      }

    })

    res.redirect(req.get('referer'));
});


//email for notifications
router.post('/email', function(req, res, next) {
  var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'liyiase3002@gmail.com',
    pass: 'Liyi@ase123'
  }
});

var mailOptions = {
  from: 'liyiase3002@gmail.com',
  to: 'cr7roxdswk@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

  res.redirect('.');
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
  var score = 0;

  details.once('value',
  function(snapshot) {
    details_dict = snapshot.val();
    //console.log(snapshot.val());
    title = details_dict.Title;
    console.log(title);
    delete details_dict.Title;
    console.log(details_dict);

     //get actual answers in an array
    var answerkey = [];
    for(var x=0;x<Object.keys(details_dict).length;x++){
      answerkey[x] = details_dict["Question" + (x+1)]["answer"];
    }

    console.log("LOL " + answerkey);

    //store user's answers in an array 
    var answer = [];
    for(var x=0;x<req.body.testing;x++){
      answer[x] = req.body["q" + (x+1)];
    }

    //calculate score
    for(var x=0;x<req.body.testing;x++){
       if(answer[x]==answerkey[x]){
         score += 1;
       }
    }

    console.log("AAA " + answer);

    res.render('quizscore', {answers: answer, answerkey: answerkey, details: details_dict, title: title, score: score, quesnos: req.body.testing});

  })


});

//post to view quiz
router.post('/viewquiz', function(req, res, next) {
  details_dict = {};
  //Need to add in dynamic coursecode and quiz number
  coursecode = "CZ4047";
  quizno = "Quiz3";
 // details_dict = db.viewQuiz(coursecode,quizno);

 var details = firebase.database().ref('/'+ coursecode + "/quizzes/" +quizno);
 details.once('value',
 function(snapshot) {
   details_dict = snapshot.val();
   console.log("YOYO: " + snapshot.val());
   if (Object.keys(details_dict).length < 0)
   {
       console.log("DB View Quiz Error");
   }

   var title = details_dict.Title;
   delete details_dict.Title;
   console.log("New : "+ details_dict);
   
   res.render('attemptquiz', { quiz: details_dict, title: title, coursecode: coursecode, quizno: quizno});

 }) 

});

//up vote and down vote
router.post('/votepost', isLoggedIn, function(req, res, next) {
  threadid = req.body.threadid;
  var coursecode = "CZ"+req.body.threadid.split("CZ")[1]
  var threadid = req.body.threadid.split("CZ")[0];
  var postid = req.body.votebutton.split(";")[0];
  var IsVote = req.body.votebutton.split(";")[1];
  db.votePost(coursecode,threadid,postid,IsVote);
  
  res.redirect(req.get('referer'));
});

//edit a particular post

router.post('/editpost', function(req, res, next) {
  
  console.log('Editing Post');

  //need to add dynamic inputs from pug form
  var coursecode = req.body.coursecode;
  var threadid = req.body.threadid;
  var postid = req.body.editarrow.split(";")[0];
  //var content = req.body.content;
  var content = "testing the edit function"
  db.editPost(coursecode,threadid,postid,content,username);

  res.redirect(req.get('referer'));
});

//delete a post

router.post('/deletepost', function(req, res, next) {
  // Can add in logic to check if post belongs to user before deleting and sending res back to front end
  console.log('Deleting Post');
  var coursecode = req.body.coursecode;
  var threadid = req.body.threadid;
  var postid = req.body.deletearrow.split(";")[0];

  console.log(coursecode + ";" + threadid + ";" + postid);
  db.deletePost(coursecode,threadid,postid);

  res.redirect(req.get('referer'));
});

//create a post
router.post('/makepost', isLoggedIn, function(req, res, next) {
  console.log('Making New Post :' + req.body.coursecode + " ; " + req.body.threadid + username);
  var coursecode = req.body.coursecode;
  var threadid = req.body.threadid; 

  var newPost =
    {
      id : " ",
      username : username,
      content : req.body.content,
      dateTime : Date.now(),
      noOfVotes : 0,
      replyTo : " ",
    }

  db.makePost(coursecode,threadid,newPost,username);
  
  res.redirect(req.get('referer'));
});

// Post and Get Method for displaying of Posts on particular thread
router.post('/main/:thread_id', isLoggedIn, function(req, res, next){
  console.log("Posting to particular thread");
  threadid = req.body.id;
  coursecode = req.body.coursecode;
  title = req.body.title;
  details_dict = {};
  details_dict = db.getAllPosts(coursecode,threadid);
  db.increaseViewCount(req.body.coursecode,req.body.id);
  
  // Pass only Post into data parameter
  dataArray = [];
  Object.keys(details_dict).forEach(function(key){
    if(key.includes("Post")){
      dataArray.push(details_dict[key]);
    }
  });

  res.render('thread', { title: title, data: dataArray, threadid: req.body.id , coursecode: req.body.coursecode});
});

router.get('/main/:thread_id', isLoggedIn, function(req, res, next){
  console.log("Getting particular thread");
  if (req.body.id == null){
    newthreadid= threadid;
  }
  else{
    newthreadid = req.body.id;
  }
  if (req.body.coursecode == null){
    newcoursecode = coursecode;
  }
  else{
    newcoursecode = req.body.coursecode;
  }
  if (req.body.title == null){
    newtitle = title;
  }
  else{
    newtitle = req.body.title;
  }

  console.log("Test456 : " + threadid);
  details_dict = {};
  details_dict = db.getAllPosts(newcoursecode,newthreadid);

  // Pass only Post into data parameter
  dataArray = [];
  Object.keys(details_dict).forEach(function(key){
    if(key.includes("Post")){
      dataArray.push(details_dict[key]);
    }
  });
  
  res.render('thread', { title: newtitle, data: dataArray, threadid: newthreadid , coursecode: newcoursecode});
});


router.get('/thread', function(req, res, next){
  res.render('thread', { title: 'Developer', data: thread.get_thread_replies(0), threadid: thread.get_thread_size(0)});
});

// view quiz
router.get('/quiz', function(req, res, next){ 
  if (username != null) {
    res.render('quiz');
  } else {
    res.render('error404');
  }
});

router.get('/profile', function(req, res, next){
  console.log('Entering profile')
  Promise.resolve(main_page.UniqueCourse(username)).then(function(value){
    Promise.resolve(profile.getUserDetails(username)).then(function(UserValue){
      res.render('profile', { coursecode: value, CGPA: UserValue[0], DOA: UserValue[1], Programme: UserValue[2], Status: UserValue[3], StudyYear: UserValue[4], Type: UserValue[5], Role: UserValue[6], title: 'profile', username: username})
    });
  });
})

router.get('/bookmarks', function(req, res, next){

  username = 'admin';
  finalthread_dict = {}
  tmpthread_dict = {}

  courseArray = main_page.UniqueCourse(username);
  console.log(courseArray);
  for (var x = 0; x < courseArray.length; x++){
    tmpthread_dict = db.getAllThreadsinOneCourse(courseArray[x]);
    finalthread_dict = Object.assign({}, finalthread_dict, tmpthread_dict);
  }

  res.render('bookmarks', { coursecode: courseArray, title: 'Bookmarks', username: username, data: finalthread_dict});
});

module.exports = router;
