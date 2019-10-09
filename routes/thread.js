// EXPORTED METHODS
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
    'username': 'Developer',
    'content': 'Development Phase SOMETHING LONG!!!!   ojjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjlolpawodawjpdoawjpdojawpdoajpdwojWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
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