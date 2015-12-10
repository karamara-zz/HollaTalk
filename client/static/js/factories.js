    var hollaApp = angular.module('hollaApp', ['ngRoute']);
    var user;
//     if (!user){
//   window.location.href="#/";
// }
// above three lines disabled for testing
  hollaApp.factory('ChatroomFactory', function($http, $location, socket){
    console.log("chatroomFactory loading");
    var _this = this;
    var factory = {}
    socket.on('receiver', function(data){
      console.log("emit", data);
      _this.sendTo = data.cSocketID;
    })
    factory.showChat = function(conversation, callback){
      console.log("send http request to get conversation with the friend and user using friend's phonenumber");
    }
    factory.startChatroom = function(friend, callback){
      $location.path('/chatroom')
      callback()
    }
    factory.sendMessage = function(message){
      console.log(message,"sending to", this.sendTo, "send message factory")
      
    }
    return factory;
  })
  hollaApp.factory('UserFactory', function($http, $location) {
    console.log("factory at work")
    var factory = {};
    factory.user;
    var _this = this;
    factory.logIn = function(newUser, callback) {
      // console.log("adding", newUser)
      $http.post('/logIn', newUser).success(function(res){
        _this.user = res
        console.log("success", res)
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
    factory.showFriends = function( user, callback){
      console.log("sending request to server to find firends list for user", user);
      $http.get('/friendsList/'+ user).success(function(res){
        console.log("get back the friend list", res);
        callback(res);
       // $location.path('/');
      })
    }
    return factory;
  })