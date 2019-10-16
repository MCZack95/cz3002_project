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

module.exports.editPost = (coursecode,threadid,postid,content,username) => {
  details_dict = {};
  var newthreadid = threadid.split("CZ")[0];
  var details = firebase.database().ref('/'+ coursecode + "/threads/" + coursecode+"Thread"+newthreadid + "/Post" + postid);
  //console.log(req.body.coursecode);
  details.once('value',
  function(snapshot) {
    details_dict = snapshot.val();
    console.log(snapshot.val());
    //push new content to DB
    details.child("content").set(content);
    details.child("dateTime").set(Date.now());
  })

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
  this.increaseRepliesCount(coursecode,threadid);

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
  return Promise.resolve(
    firebase.database().ref('/'+coursecode+'/threads').once('value',function(snapshot) {})
    ).then(function(snapshot){
    details_dict = snapshot.val()
    //console.log(snapshot.val());
    if (Object.keys(details_dict).length < 0)
    {
        console.log("DB get All Threads from course Error");
    }
    return details_dict;
  });
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


module.exports.increaseRepliesCount = (coursecode,threadid) => 
{
  console.log("Increasing replies count");
  details_dict = {}
  threadid = threadid.split("CZ")[0];
  var details = firebase.database().ref('/'+coursecode+'/threads/'+coursecode+'Thread'+threadid);
  details.once('value',
  function(snapshot) {
    details_dict = snapshot.val()
    var replies = details_dict["noOfReplies"];
    console.log("Course Code : " + coursecode + "Thread ID : " + threadid + "Replies : " + replies)
    replies += 1;
    details.child("noOfReplies").set(replies);
  });
}