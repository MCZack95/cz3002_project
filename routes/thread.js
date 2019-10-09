var express = require('express');
var router = express.Router();

var main_page = require('./main_page');
var db = require('./db');


router.get('/', function(req, res, next) {
    res.render('createthread');
})

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

  // can change this to directly to the new thread
  res.redirect('/createthread');
});

module.exports = router;

/**  EXPORTED METHODS
module.exports.get_thread_size = (t_id) => {
  return get_thread(t_id).length;
};

module.exports.get_thread_replies = (t_id) => {
  return get_thread(t_id);
}
 
// LOCAL METHODS
function get_all_replies(){
  return replies;
};

function get_thread(t_id){
  reply_list = [];
  get_all_replies().forEach(function(reply){
    if (reply.t_id == t_id) {
      reply_list.push(reply);
    }
  });
  return reply_list;
};

// HARDCODE DATA
var replies = [
  {
    't_id': 1,
    'r_id': 1,
    'user': 'Shan Jing',
    'content': 'I think there is a Neutron Star! I would love to see one! :)',
    'reply_pos': 1
  },
  {
    't_id': 1,
    'r_id': 2,
    'user': 'Darien',
    'content': 'That\'s stupid.',
    'reply_pos': 2
  },
  {
    't_id': 4,
    'r_id': 3,
    'user': 'Shan Jing',
    'content': 'I don\'t know. I only eat Western.',
    'reply_pos': 1
  },
  {
    't_id': 1,
    'r_id': 4,
    'user': 'Shan Jing',
    'content': 'A Blackhole would be even better!',
    'reply_pos': 3
  },
  {
    't_id': 3,
    'r_id': 5,
    'user': 'Zhi Hong',
    'content': 'Type \'npm i -g nodemon\' to install. Then type \'npm install\' to setup dependencies. Finally type \'nodemon\' to run the app.',
    'reply_pos': 1
  },
  {
    't_id': 4,
    'r_id': 6,
    'user': 'Christopher',
    'content': 'Nah. It\'s Curry Chicken Noodle.',
    'reply_pos': 2
  },
  {
    't_id': 1,
    'r_id': 7,
    'user': 'Andrew',
    'content': 'Stop it.',
    'reply_pos': 4
  },
  {
    't_id': 3,
    'r_id': 8,
    'user': 'Shan Jing',
    'content': 'Or just type \'npm start\' also can.',
    'reply_pos': 2
  },
  {
    't_id': 4,
    'r_id': 9,
    'user': 'Zhi Hong',
    'content': 'I thought you liked the Seafood Horfun?',
    'reply_pos': 3
  },
  {
    't_id': 4,
    'r_id': 10,
    'user': 'Christopher',
    'content': 'The standard has dropped.',
    'reply_pos': 4
  },
  {
    't_id': 0,
    'r_id': 0,
    'user': 'Developer',
    'content': 'Development Phase',
    'reply_pos': 1
  },
  {
    't_id': 5,
    'r_id': 11,
    'user': 'Qi Yuan',
    'content': 'Do I have to do MDP?',
    'reply_pos': 1
  }
];

**/