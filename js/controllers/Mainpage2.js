myApp.controller('Mainpage2Controller', function($firebaseAuth) {
  var Auth = $firebaseAuth()
  // Auth.$signOut();
  console.log(Auth.$requireSignIn())
}); // controller

    //
