var firebase = require('firebase');

// EXPORTED MAIN_PAGE METHODS
module.exports.get_all_forum_data = () => {
  return get_data();
}

module.exports.UniqueCourse = (t_id) => {
  //return Promise.resolve(UniqueCourse(t_id)).then(function(value){return value;})
  return UniqueCourse(t_id)
}

module.exports.MergeSortThread = (object) => {
  return MergeSortThread(object)
}

function MergeSortThread(object){
  //console.log(object);

  Dict = {};
  tList = [];

  //Split by threads
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      if (tList.length == 0){tList.push({[key] : object[key]})}
      else{

        counter = 0;

        //Iterate through each thread in list
        tList.forEach(function(item,index){

          //Check if element is alr inserted
          if (counter == 0){

            //Get date element to compare
            for (var key2 in item){
              if (object.hasOwnProperty(key)){
                listDate = item[key2].dateMod;
                newDate = object[key].dateMod;

                /*
                console.log("");
                console.log(key2);
                console.log(listDate);
                console.log(newDate);
                console.log("");
                */

                if (newDate > listDate){
                  counter = 1;
                  tList.splice(index,0,{[key] : object[key]});
                }
              }
            }
          }
        })

        if (counter == 0){
          tList[tList.length] = {[key] : object[key]};
        }
      }
    }
  }

  tList.forEach(function(item,index){
    for (var key in item){
      Dict[key] = item[key]
    }
  })
  return Dict;
  //console.log(Dict);
}

// LOCAL METHODS
function get_data(){
  return forum_data;
};

// Get Unique Course ID
function UniqueCourse(t_id){
  var courseArray = []
  details = firebase.database().ref('/users').once('value',function(snapshot) {
    details = snapshot.val();
    //console.log(snapshot.val());

    for (var key in details) {
      if (details[key].username == t_id){
        //console.log("Details of Array " + details[key].courses.split(','));
        courseArray = details[key].courses.split(',');
      }
    }
  });
  return courseArray;
}

// Filter Course
function filterCourse(){

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
