myApp.controller('PersonnelController', function($firebaseAuth) {
  var Auth = $firebaseAuth()
  // Auth.$signOut();
  console.log(Auth.$requireSignIn())
}); // controller

    //
