// EXPORTED MAIN_PAGE METHODS
module.exports.getForumData = async () => {
  var string_data_list = "";
  return Promise.resolve(get_data()).then(function(data){
    // Parse data
    data.forEach(function(record){
      if (data.indexOf(record) != 0) {
        string_data_list += "_";
      }
      string_data_list += parseData(record['id']);

      string_data_list += '~' + parseData(record['title']);

      string_data_list += "~";
      record['tags'].forEach(function(tag){
        if (record['tags'].indexOf(tag) == 0) {
          string_data_list += parseData(tag);
        } else {
          string_data_list += "+" + parseData(tag);
        }
      });
      
      string_data_list += '~' + parseData(record['num_of_replies']);
      string_data_list += '~' + parseData(record['rating']);
    });

    return string_data_list;
  });
}

// LOCAL METHODS
function get_data(){
  return forum_data;
};

function parseData(data){
  data = data.toString();
  data = data.replace(/\~/g, '');
  data = data.replace(/\+/g, '');
  return data;
}

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
    'title': 'How do you used nodemon?',
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
