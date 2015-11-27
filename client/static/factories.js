    var hollaApp = angular.module('hollaApp', []);
  hollaApp.factory('UserFactory', function($http) {
    console.log("factory at work")
    var factory = {};
    factory.addUser = function(newUser, callback) {
      $http.post('/newUser', newUser).success(function(res){
        console.log("success", res)
        callback();
      });
    }
    return factory;
  })