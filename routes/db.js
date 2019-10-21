var express = require('express');
var router = express.Router();
var firebase = require('firebase');


module.exports.getAllPosts = (coursecode,threadid) => {
    console.log("Getting All Posts : " + coursecode + threadid );
    details_dict = {};
    var details = firebase.database().ref('/'+coursecode+'/threads/'+coursecode +'Thread'+threadid.split("CZ")[0]);
    details.orderByKey().startAt("Post").endAt("Post"+"\uf8ff").once('value',
    function(snapshot) {
      details_dict = snapshot.val()
      console.log("Thread ID : "+ threadid + " /n "+ JSON.stringify(snapshot.val()));
      if (Object.keys(details_dict).length < 0)
      {
          console.log("DB Query Error");
      }
    });

    return details_dict;
  }

module.exports.votePost = (coursecode,threadid,postid,isVote) => {

  var votes;
  details_dict = {}
  console.log("Course : " + coursecode);
  console.log("Thread ID : " + threadid);
  console.log("Post ID : " + postid);
  console.log("Up or Down Vote : " + isVote);

  var details = firebase.database().ref('/'+ coursecode + "/threads/" + coursecode+"Thread"+threadid + "/Post" + postid);
  details.once('value',
  function(snapshot) {
    details_dict = snapshot.val();
    console.log(snapshot.val());
    votes = details_dict["noOfVotes"];
    if (isVote == 3){
      votes += 1;
      console.log("Up vote to : " + votes);
    }
    else if (isVote ==4){
      votes -= 1;
      console.log("Down vote to : " + votes);
    }
    else{
      console.log("Not upvote or downvote");
    }
    
    details.child("noOfVotes").set(votes);

    })

    if (Object.keys(details_dict).length < 0)
    {
        console.log("DB Query Error");
        return false;
    }
    return true;
  }

module.exports.editPost = (coursecode,threadid,postid,content,username,hasquote,quoteowner,quotecontent) => {
  details_dict = {};
  var newthreadid = threadid.split("CZ")[0];
  var details = firebase.database().ref('/'+ coursecode + "/threads/" + coursecode+"Thread"+newthreadid + "/Post" + postid);
  //console.log(req.body.coursecode);
  details.once('value',
  function(snapshot) {
    details_dict = snapshot.val();
    console.log("Editing this post : " + JSON.stringify(snapshot.val()));
    //push new content to DB
    details.child("content").set(content);
    details.child("dateTime").set(Date.now());
  })

  if (hasquote === "true")
  {
    //console.log("This edit post has quotes : " + hasquote + quoteowner + quotecontent)
    var quote = 
    {
      quote_owner : quoteowner,
      quote_content : quotecontent,
    }
    var details = firebase.database().ref('/'+ coursecode + "/threads/" + coursecode+"Thread"+newthreadid + "/Post" + postid);
  //console.log(req.body.coursecode);
  details.once('value',
  function(snapshot) {
    details_dict = snapshot.val();
    console.log(snapshot.val());
    //push new content to DB
    details.child("quote").set(quote);
  })
  }
  else{
    console.log("Removing quotes")
    var details = firebase.database().ref('/'+ coursecode + "/threads/" + coursecode+"Thread"+newthreadid + "/Post" + postid);
    //console.log(req.body.coursecode);
    details.once('value',
    function(snapshot) {
      details_dict = snapshot.val();
      console.log(snapshot.val());
      //delete quotes
      if (snapshot.hasChild("quote")){
        console.log("Quotes exists : " + details["quote"]);
        details.child("quote").set(null);
      }
      else{
        console.log("Quotes do not exists");
      }
  });
}

  //update thread details
  this.updateThreadDetails(coursecode,threadid,username);
}

module.exports.deletePost = (coursecode,threadid,postid) => 
{
  details_dict = {};
  newthreadid = threadid.split("CZ")[0];
  var details = firebase.database().ref('/'+ coursecode + "/threads/" + coursecode+"Thread"+newthreadid + "/Post" + postid);
  details.once('value',
  function(snapshot) {
    details_dict = snapshot.val();
    console.log(snapshot.val());
    details.remove();
  }
  )
  this.updateRepliesCount("decrease",coursecode,threadid);
}

module.exports.makePost = (coursecode,threadid,newpost,username) => {
  console.log("Making Post");
  details_dict = {};
  var newthreadid = threadid.split("CZ")[0];
  var details = firebase.database().ref('/'+coursecode+"/threads/"+coursecode+"Thread"+newthreadid);
 
  // creating post
  details.orderByKey().startAt("Post").endAt("Post"+"\uf8ff").once('value',
  function(snapshot) {
    details_dict = snapshot.val()
    console.log(snapshot.val());
    var noOfPosts = Object.keys(details_dict).length;
    var newpostno = noOfPosts + 1;
    var id = noOfPosts + 1;
    newpost["id"] = id;
    details.child("Post" + newpostno).set(newpost);
    console.log("New Post successfully created at : " + coursecode + " Thread : " + newthreadid + "Post : " +id)
    //var details = firebase.database().ref('/'+coursecode+"/threads/"+coursecode+"Thread"+newthreadid);
    //var replies = details_dict["noOfReplies"] + 1;
    //console.log("Number of Replies in Thread incremented to : " +replies );
    //details.child("noOfReplies").set(replies);
  });

  //updating number of replies
  this.updateRepliesCount("increase",coursecode,threadid);

  //updating thread details
  this.updateThreadDetails(coursecode,threadid,username);
}

/**may be redundant
module.exports.createThread = (coursecode) => 
{
  details_dict = {}

  var details = firebase.database().ref('/'+coursecode+"/threads");
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
  details.child(req.body.coursecode+"Thread"+(newThreadindex)).child("Post1").set(newThread);
  // Post 1 cause create thread always is first post
  
  var details = firebase.database().ref('/'+req.body.coursecode+"/threads/"+req.body.coursecode+"Thread"+ newThreadindex);
  details.child("Title").set(req.body.title);

  console.log('hi'+req.body.coursecode);

}
**/

module.exports.viewQuiz = (coursecode,quizno) => 
{
  details_dict = {}
  var details = firebase.database().ref('/'+ coursecode + "/quizzes/" +quizno);

  details.once('value',
  function(snapshot) {
    details_dict = snapshot.val();
    console.log("YOYO: " + snapshot.val());
    if (Object.keys(details_dict).length < 0)
    {
        console.log("DB View Quiz Error");
    }
    
  })

  return details_dict;

}

module.exports.getAllThreadsinOneCourse = (coursecode) => 
{
  details_dict = {}
  var details = firebase.database().ref('/'+coursecode+'/threads')
  details.once('value',function(snapshot) {
    details_dict = snapshot.val()
    //console.log(snapshot.val());
    if (Object.keys(details_dict).length < 0)
    {
        console.log("DB get All Threads from course Error");
    }
  });
  return details_dict;
}

module.exports.increaseViewCount = (coursecode,threadid) => 
{
  details_dict = {}
  threadid = threadid.split("CZ")[0];
  var details = firebase.database().ref('/'+coursecode+'/threads/'+coursecode+'Thread'+threadid);
  details.once('value',
  function(snapshot) {
    details_dict = snapshot.val()
    var views = details_dict["viewcount"];
    console.log("Course Code : " + coursecode + "Thread ID : " + threadid + "View : " + views)
    views += 1;
    details.child("viewcount").set(views);
  });
}

// like last modified by which user and which time for display on main page
module.exports.updateThreadDetails = (coursecode,threadid,username) => 
{
  console.log("Updating thread details");
  details_dict = {}
  threadid = threadid.split("CZ")[0];
  var details = firebase.database().ref('/'+coursecode+'/threads/'+coursecode+'Thread'+threadid);
  details.once('value',
  function(snapshot) {
    details_dict = snapshot.val()
    console.log("username " + username + Date.now());
    details.child("lasteditedby").set(username);
    details.child("dateMod").set(Date.now());
  });
}


module.exports.updateRepliesCount = (update,coursecode,threadid) => 
{
  console.log("Update replies count");
  details_dict = {}
  threadid = threadid.split("CZ")[0];
  var details = firebase.database().ref('/'+coursecode+'/threads/'+coursecode+'Thread'+threadid);
  details.once('value',
  function(snapshot) {
    details_dict = snapshot.val()

    var replies = details_dict["noOfReplies"];
    console.log("Course Code : " + coursecode + "Thread ID : " + threadid + "Replies : " + replies)
    if (update== "increase"){
      replies += 1;
    }
    else{
      replies -= 1;
    }
    details.child("noOfReplies").set(replies);
  });
}


module.exports.getAllCourses = (username) => 
{
  console.log("IN DB.JS >> " + username);
  details_dict = {};
  var courseArray = [];
  var details = firebase.database().ref('/users');
  details.once('value',function(snapshot) {
    details_dict = snapshot.val();
    console.log("SNAPSHOT>>" +snapshot.val());
    for (var key in details_dict) {
      if (details.hasOwnProperty(key)) {
        //console.log(key + " , " + details[key].username + "\n");
        if (details[key].username == username){
          //console.log("Details of Array " + details[key].courses.split(','));
          courseArray = details[key].courses.split(',');
        }
      }
    }
  });
  console.log("WHAT?>>" + courseArray);
  return courseArray;
}

module.exports.getQuizzes = (coursecode) => 
{
  details_dict = {}
  var details = firebase.database().ref('/'+ coursecode + "/quizzes");

  return details.once('value',
  function(snapshot) {
    details_dict = snapshot.val();
    console.log("Quizzes Value : " + JSON.stringify(snapshot.val()));   
    return details_dict;
  })

  

}

module.exports.getStudySession = (coursecode) => 
{
  details_dict = {}
  var details = firebase.database().ref('/'+ coursecode + "/study");

  return details.once('value',
  function(snapshot) {
    details_dict = snapshot.val();
    console.log("Study Session for Course Code  : " + coursecode + " | " + JSON.stringify(snapshot.val()));   
    return details_dict;
  })
}


module.exports.joinStudySession = (username,coursecode,studysession) => 
{
  details_dict = {}
  details_dict1 = {};
  var details = firebase.database().ref('/'+ coursecode + "/study/" + studysession);
  details.once('value',
  function(snapshot) {
    details_dict = snapshot.val();
    console.log("Editing Study Session for Course Code  : " + coursecode + " | " + JSON.stringify(snapshot.val()));   
    slots = details_dict["vacancies"];
    slots -= 1;
    details.child("vacancies").set(slots);
    
    console.log("Attendees : " + details_dict["attendees"]);

    if (details_dict["attendees"] != null){
      var attendees = details_dict["attendees"] + "," + username;
    }
    else{
      var attendees = username;
    }
    console.log("New Attendees : " + attendees);
    details.child("attendees").set(attendees);
  })
}


module.exports.getCompletedQuiz = (coursecode) => 
{
  details_dict = {}
  var details = firebase.database().ref('/'+ coursecode + "/donequizzes");

  return details.once('value',
  function(snapshot) {
    details_dict = snapshot.val();
    console.log("Past quizzes for Course Code  : " + coursecode + " | " + JSON.stringify(snapshot.val()));   
    return details_dict;
  })
}
