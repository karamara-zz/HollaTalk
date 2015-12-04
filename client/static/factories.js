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
      console.log("new friend addding sending the post request", newFriend)
      $http.post('/newFriend', newFriend).success(function(res){
        console.log("new friend adding", newFriend)
        console.log(res, "response")
        callback()
      });
    }
    factory.showFriends = function( user, callback){
      console.log("sending request to server to find firends list for user", user);
      $http.get('/friendsList/'+user).success(function(res){
        console.log("get back the friend list");
        callback(res);
      })
    }
    return factory;
  })