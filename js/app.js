var myApp = angular.module('myApp',
            ['ngRoute','firebase'])
            .constant('FIREBASE_URL', 'https://yunhyeok2-eaba9.firebaseio.com/')


myApp
.run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function(event, next, previous, error) {
        if(error = 'AUTH_REQUIRED') {
          $rootScope.message = 'Sorry you must log in to access that page';
          $location.path('/Mainpage');
        }// AUTH Required
    }) // event info
  }]);

myApp
.config(['$routeProvider', function($routeProvider) {
    // credits for this idea: https://groups.google.com/forum/#!msg/angular/dPr9BpIZID0/MgWVluo_Tg8J
    // unfortunately, a decorator cannot be use here because they are not applied until after
    // the .config calls resolve, so they can't be used during route configuration, so we have
    // to hack it directly onto the $routeProvider object
    $routeProvider.whenAuthenticated = function(path, route) {
      route.resolve = route.resolve || {};
      route.resolve.user = ['$firebaseAuth', function($firebaseAuth) {
        var Auth = $firebaseAuth();
        return Auth.$requireSignIn();
      }];
      $routeProvider.when(path, route);
      // SECURED_ROUTES[path] = false;
      return $routeProvider;
    };
  }])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/MainPage', {
      templateUrl: './views/Mainpage.html',
      controller: 'MainPageController'
    })
    .when('/login', {
      templateUrl: './views/login.html',
      controller: 'registrationController'
    })
    .when('/register', {
      templateUrl: 'views/register.html',
      controller: 'registrationController'
    })
    .when('/Research', {
      templateUrl: 'views/Research.html',
      controller: 'ResearchController'
    })
    .when('/Personnel', {
      templateUrl: 'views/Personnel.html',
      controller: 'PersonnelController'
    })
    .whenAuthenticated('/Mainpage2', {
      templateUrl: 'views/Mainpage2.html',
      controller: 'Mainpage2Controller'
      // resolve: {
      //   currentAuth: function(Authentication) {
      //     return Authentication.requireAuth();
      //   }
      // } // Resolve
    })
    // .when('/Personnel', {
    //   templateUrl: 'views/Personnel.html',
    //   controller: 'PersonnelController',
    //   resolve: {
    //     currentAuth: function(Authentication) {
    //       return Authentication.requireAuth();
    //     }
    //   } // Resolve
    // })
    .otherwise({
      redirectTo: '/MainPage'
    });
}])


// .when('/meetings/:uId/:mId', {
//   templateUrl: 'views/meetings.html',
//   controller: 'MeetingsController',
//   resolve: {
//     currentAuth: function(Authentication) {
//       return Authentication.requireAuth();
//     }
//   } // Resolve
// })
// .when('/checkins/:uId/:mId', {
//   templateUrl: 'views/checkins.html',
//   controller: 'CheckInsController'
// })
// .when('/checkins/:uId/:mId/checkinsList', {
//   templateUrl: 'views/checkinlist.html',
//   controller: 'CheckInsController'
// })
// .when('/D3Viewer/:uId/:mId', {
//   templateUrl: 'views/D3Viewer.html',
//   controller: 'd3Ctrl',
//   resolve: {
//     currentAuth: function(Authentication) {
//       return Authentication.requireAuth();
//     }
//   } // Resolve
// })
// .when('/D3Viewer2/:uId/:mId', {
//   templateUrl: 'views/D3Viewer2.html',
//   controller: 'd3Ctrl2',
//   resolve: {
//     currentAuth: function(Authentication) {
//       return Authentication.requireAuth();
//     }//current Auth
//   } // Resolve
// })
// .when('/D3Viewer3/:uId/:mId', {
//   templateUrl: 'views/D3Viewer3.html',
//   controller: 'd3Ctrl3',
//   resolve: {
//     currentAuth: function(Authentication) {
//       return Authentication.requireAuth();
//     }
//   } // Resolve
// })

myApp.controller('appController', ['$scope', function($scope) {
  $scope.message = "Welcome to my App Main JS File";
}]);
