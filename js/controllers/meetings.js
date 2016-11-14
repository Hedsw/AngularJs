myApp.controller('MeetingsController',
    ['$scope', '$rootScope', '$firebaseAuth', '$firebaseArray', 'FIREBASE_URL',
    function($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL) {

            var ref = firebase.database().ref();
            var auth = $firebaseAuth();

          auth.$onAuthStateChanged(function(authUser) {
            if(authUser) {
              var meetingsRef = ref.child('users/').child($rootScope.currentUser.$id).child('/meetings');
              var meetingsInfo = $firebaseArray(meetingsRef);
              $scope.meetings = meetingsInfo;

                  meetingsInfo.$loaded().then(function(data) {
                    $rootScope.howManyMeetings = meetingsInfo.length;
                  }); //Make sure meeting data is loaded

                  meetingsInfo.$watch(function(data) {
                    $rootScope.howManyMeetings = meetingsInfo.length;
                  }); //Make sure meeting data is loaded


              $scope.addMeeting = function() {
                meetingsInfo.$add({
              name:  $scope.meetingname,
              date: firebase.database.ServerValue.TIMESTAMP ,
            }).then(function() {

              $scope.meetingname = '';
            }); //promise
          }; //addMeeting
              $scope.deleteMeeting = function(key) {
                meetingsInfo.$remove(key);
              }; // DeleteMeeting

            } // User Authenticated
          }); //on Auth
}]); // controller

//
//
