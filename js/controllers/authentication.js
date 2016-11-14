myApp.factory('Authentication',
['$rootScope','$firebaseAuth', '$firebaseObject',
 '$location','FIREBASE_URL',
function($rootScope, $firebaseAuth, $firebaseObject, $location, FIREBASE_URL){

  var ref = firebase.database().ref();
  var auth = $firebaseAuth();


// DB 안에 있는 것을 받아와서 출력 해줌..
///////////////////////////////////////////////////
      auth.$onAuthStateChanged(function(authUser) {
        if (authUser) {
            var userRef = ref.child('users').child(authUser.uid)
            var userObj = $firebaseObject(userRef);
             $rootScope.currentUser = userObj;
        }
        else {
          $rootScope.currentUser = 'Check the Error!!';
        }
      });

///////////////////////////////////////////////////////////////

// login 화면 안에서 노는 건데, email이랑 password가 정확하다면, success 홈페이지로 들어감
    var myObject =  {
      login: function(user) {
        auth.$signInWithEmailAndPassword (
        user.email,
        user.password
        )
        .then(function (regUser) {
          $location.path('/Mainpage2');
        }).catch(function(error) {
          $rootScope.message = error.message;  // 여기서 rootScope가 뭐지 ??
        });
        $rootScope.message = "Welcome " + user.email;
      }, //Login

      logout: function() {
        return auth.$signOut();
      }, //logout

      requireAuth: function () {
        return auth.$requireSignIn();
      }, // require Authentication

// register 화면에 대한 것.. email이랑 password에 대한 것! 입력 받은 것을 Auth 안에다가 email, password를 넣어 줄 뿐만
//아니라 그것을 DB 안에다가도 넣어서 그걸 가지고 뭘 하는 것도 만든 것임.
      register: function(user) {
        //이 부분은 Register창에서 받은 것을 Auth 안에 넣어 두는 것.
        auth.$createUserWithEmailAndPassword (
            user.email,
            user.password
            )
          .then(function(regUser) {
////////////////////////////////////////////////////////////
// 입력 받은 값을 Database 안에다가 넣는 것!
            var userInfo = {
              date: firebase.database.ServerValue.TIMESTAMP ,
              regUser: regUser.uid,
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email
            }

            var ref = firebase.database().ref();
            var regRef = ref.child('users').child(regUser.uid).set(userInfo);
////////////////////////////////////////////////////////////////
            myObject.login(user);

          }).catch(function(error) {
            $rootScope.message = error.message;
          }); // createUser
        }// register
    };


    return myObject;
}]); // Factory Part
