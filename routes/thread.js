// EXPORTED METHODS
module.exports.get_thread_replies = async (t_id) => {
  string_data_list = "";
  return Promise.resolve(get_thread_replies(t_id)).then(function(replies){
    // Parse data
    replies.forEach(function(reply){
      if (replies.indexOf(reply) != 0) {
        string_data_list += "_";
      }
      string_data_list += parseData(reply['reply_pos']);

      string_data_list += '~' + parseData(reply['user']);

      string_data_list += '~' + parseData(reply['content']);
    });

    return string_data_list;
  });
};

module.exports.get_thread_size = async (t_id) => {
  return get_thread_replies(t_id).length;
};

// LOCAL METHODS
function get_all_replies(){
  return replies;
};

function get_thread_replies(t_id){
  reply_list = [];
  get_all_replies().forEach(function(reply){
    if (reply.t_id == t_id) {
      reply_list.push(reply);
    }
  });
  return reply_list;
};

function parseData(data){
  data = data.toString();
  data = data.replace(/\~/g, '');
  data = data.replace(/\+/g, '');
  return data;
}

// OTHERS
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