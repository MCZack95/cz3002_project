// EXPORTED MAIN_PAGE METHODS
module.exports.get_all_forum_data = () => {
  return get_data();
}

// LOCAL METHODS
function get_data(){
  return forum_data;
};

// HARDCODE DATA
var forum_data = [
  { 
    'id': 1,
    'title': 'Is there a neutron star in the milky way?',
    'tags': ['code1', 'code4', 'code7'],
    'num_of_replies': 42,
    'rating': 32 
  },
  { 
    'id': 2,
    'title': 'What is an inductor used for?',
    'tags': ['code2', 'code5'],
    'num_of_replies': 2,
    'rating': 4 },
  { 
    'id': 3,
    'title': 'How do you use nodemon?',
    'tags': ['code3', 'code6'],
    'num_of_replies': 3,
    'rating': 17 
  },
  { 
    'id': 4,
    'title': 'What is the best dish in North Spine Food Court?',
    'tags': [],
    'num_of_replies': 132,
    'rating': 89 
  },
  { 
    'id': 5,
    'title': 'Do we have to do FYP?',
    'tags': ['code99'],
    'num_of_replies': 23,
    'rating': -23 
  }
];
