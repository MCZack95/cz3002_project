var express = require('express');
var router = express.Router();

var main_page = require('./main_page');
var firebase = require('firebase');

router.get('/', function(req, res, next) {
    res.render('createquiz');
})

router.post('/newquiz', function(req, res, next) {
  console.log("Creating new quiz : " + req.body.title + req.body.coursecode);

  details_dict = {}

  var details = firebase.database().ref('/'+req.body.coursecode+"/quizzes");
  details.once('value',
  function(snapshot) {
    details_dict = snapshot.val()
    console.log(snapshot.val());
    if (snapshot.val()!= null){
      var noOfQuizzes = Object.keys(details_dict).length;
      var newQuizindex =  noOfQuizzes +1;
    }
    else{
      var newQuizindex = 1;
    }
    console.log("New Quiz ID : " + newQuizindex);
    for(var x=1;x<=req.body.noques;x++){

      var newQuiz =
        {
          answer : req.body["ans" + x],
          explanation : req.body["exp" + x],
          ques : req.body["question" + x],
          opt1 : req.body["opt1" + x],
          opt2 : req.body["opt2" + x],
          opt3 : req.body["opt3" + x],
          opt4 : req.body["opt4" + x],
          
        }
      
      var details = firebase.database().ref('/'+req.body.coursecode+"/quizzes");
      details.child("Quiz"+(newQuizindex)).child("Question" + x).set(newQuiz);
  
    }
    var details = firebase.database().ref('/'+req.body.coursecode+"/quizzes/Quiz"+ newQuizindex);
    details.child("Title").set(req.body.title);
    
  }
  )

  res.redirect(req.get('referer'));

});




module.exports = router;