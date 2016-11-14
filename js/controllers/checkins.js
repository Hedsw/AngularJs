myApp.controller('CheckInsController',

    function($scope, $rootScope, $firebaseObject, $location, $routeParams, $firebaseArray) {

        $scope.whichmeeting = $routeParams.mId;
        $scope.whichuser = $routeParams.uId;

        var ref = firebase.database().ref();
        var ref_re = ref.child('users/')
        .child($scope.whichuser)
        .child('/meetings/')
        .child($scope.whichmeeting)
        .child('/checkins');

        var checkinsList = $firebaseArray(ref_re);
          $scope.checkins = checkinsList;

              // console.log(ref_re);

        $scope.addCheckin = function () {
          var checkinsInfo = $firebaseArray(ref_re);
          var myData = {
              firstname: $scope.user.firstname,
              lastname: $scope.user.lastname,
              email: $scope.user.email,
              date: firebase.database.ServerValue.TIMESTAMP
          } //myData

          checkinsInfo.$add(myData).then(function() {
            $location.path('/checkins/'
            + $scope.whichuser
            + '/'
            + $scope.whichmeeting
            + '/checkinsList');
          }) // Send data to Firebase

        }; //AddCheckin

        $scope.deleteCheckin = function (id) {
            var refDel = ref.child('users/')
            .child($scope.whichuser)
            .child('/meetings/')
            .child($scope.whichmeeting)
            .child('/checkins/'
            + id);
          var record = $firebaseObject(refDel);
          record.$remove(id);
        };

  }); // controller

    //
