var firebase = require('firebase');

module.exports.getUserDetails = (t_id) => {
  //return Promise.resolve(UniqueCourse(t_id)).then(function(value){return value;})
  return getUserDetails(t_id)
}

// Get Unique Course ID
function getUserDetails(t_id){
    var UserDetails = ['NA','NA','NA','NA','NA','NA','NA']
    return Promise.resolve(
      firebase.database().ref('/users').once('value',function(snapshot) {})
      ).then(function(snapshot){
  
      details = snapshot.val();
      //console.log(snapshot.val());
  
      for (var key in details) {
        if (details.hasOwnProperty(key)) {
          //console.log(key + " , " + details[key].username + "\n");
          if (details[key].username == t_id){
                UserDetails[0] = details[key].CGPA;
                UserDetails[1] = details[key].DOA;
                UserDetails[2] = details[key].Programme;
                UserDetails[3] = details[key].Status;
                UserDetails[4] = details[key].StudyYear;
                UserDetails[5] = details[key].Type;
                UserDetails[6] = details[key].role
                return UserDetails;
            }
        }
      }
      return UserDetails;
    })
}