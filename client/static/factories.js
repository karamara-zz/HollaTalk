    var hollaApp = angular.module('hollaApp', ['ngRoute']);
    var user;
//     if (!user){
//   window.location.href="#/";
// }
// above three lines disabled for testing
  hollaApp.factory('ChatroomFactory', function($http, $location){
    console.log("chatroomFactory loading");
    var factory = {}
    factory.showChat = function(conversation, callback){
      console.log("send http request to get conversation with the friend and user using friend's phonenumber");
    }
    factory.startChatroom = function(friend, callback){
      $location.path('/chatroom')
    }
    
    return factory;
  })
  hollaApp.factory('socket',function($rootScope){
      var socket = io.connect();
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {  
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    };
  });
  hollaApp.factory('UserFactory', function($http, $location) {
    console.log("factory at work")
    var factory = {};
    factory.user;
    var _this = this;
    factory.logIn = function(newUser, callback) {
      // console.log("adding", newUser)
      $http.post('/newUser', newUser).success(function(res){
        _this.user = res
        // console.log("success", res)

        callback(res);
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
    factory.login = function(number, callback){

    }
    factory.showFriends = function( user, callback){
      console.log("sending request to server to find firends list for user", user);
      $http.get('/friendsList/'+user).success(function(res){
        console.log("get back the friend list", res);
        callback(res);
       $location.path('/main');
      })
    }
    return factory;
  })