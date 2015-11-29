    var hollaApp = angular.module('hollaApp', []);
  hollaApp.factory('UserFactory', function($http) {
    console.log("factory at work")
    var factory = {};
    factory.addUser = function(newUser, callback) {
      // console.log("adding", newUser)
      $http.post('/newUser', newUser).success(function(res){
        // console.log("success", res)
        callback();
      });

    }
    factory.newFriend = function(newFriend, callback){
      $http.post('/newFriend', newFriend).success(function(res){
        console.log("new friend adding", newFriend)
        callback()
      });
    }
    return factory;
  })