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
      console.log(message,"sending to", this.sendTo, "send message factory");
      var newMessage ;
      console.log(this.user.Id)

    }
    return factory;
  })
  hollaApp.factory('CreateFactory', function($http, $location){
    var factory = {};
    factory.login = function(){
      $location.path('/');
    }
    return factory;
  })
  hollaApp.factory('UserFactory', function($http, $location) {
    console.log("factory at work")
    var factory = {};
    var _this = this;
    factory.session = function(callback){
        $http.get('/session').success(function(res){
          console.log(res);
          if(res.user){
            factory.setUser(res.user);
            callback();
            $location.path('/main');
          }
        })
      }
    factory.create = function(){
      $location.path('/create');
    }
    factory.logIn = function(loginInfo, callback) {
      console.log("logging in", loginInfo)
      $http.post('/logIn', loginInfo).success(function(res){
        if (res.status == true){
        factory.setUser(res);
        console.log("success", res)
        callback(res);
        console.log(res.session, "here is the session")
      } else {
        console.log("invalid user")
      }
      });
    }
    factory.newFriend = function(newFriend, callback){
      console.log("new friend addding sending the post request", newFriend)
      $http.post('/newFriend', newFriend).success(function(res){
        console.log("new friend adding", newFriend)
        console.log(res, "response")
       $location.path('/');
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
    factory.logout = function(callback){
      this.user = undefined
      $location.path('#/')
      callback()
    }
    factory.getUser = function(){
      return this.user
    }
    factory.setUser = function(user){
      this.user = user;
    }
    return factory;
  })