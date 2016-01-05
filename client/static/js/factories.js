    var hollaApp = angular.module('hollaApp', ['ngRoute']);
    var user;
function checklogin(){
  console.log("checking if user exists", user)
    if (!user){
      window.location.href="#/";
    }
  }
  checklogin();
// above three lines disabled for testing
hollaApp.directive('scrollBottom', function ($timeout) {
  return {
    scope: {
      scrollBottom: "="
    },
    link: function (scope, element) {
      scope.$watchCollection('scrollBottom', function (newValue) {
        $timeout(function(){
          $(element).scrollTop($(element)[0].scrollHeight);
        })

      });
    }
  }
})
hollaApp.factory('ChatroomFactory', function($http, $location, socket){
  var factory = {}
  factory.chatroomInfo={};
  factory.chatroomInfo.sentFrom = user;
  console.log("chatroomFactory loading", factory.chatroomInfo);
  var _this = this;

  socket.on('receiver', function(data){
    console.log("emit", data);
    _this.sendTo = data.cSocketID;
  })
  factory.showChat = function(conversation, callback){
    console.log("send http request to get conversation with the friend and user using friend's phonenumber");
  }
  factory.startChatroom = function(friend, callback){
    console.log("starting the chatroom with the friend",friend, factory.chatroomInfo, _this)
    factory.chatroomInfo.sendTo = friend;
    $http.post('/chatroom', factory.chatroomInfo).success(function(chatroomData){
      console.log("post request successful", chatroomData)
      factory.chatroomData = chatroomData.chatroom;
      $location.path('/chatroom')
      factory.read();
    })
    callback()
  }
  factory.read = function(){
    console.log("updating read status")
    $http.put('/friends/read/'+factory.chatroomInfo.sentFrom._id, factory.chatroomInfo).success(function(){
      console.log('read status updated');
    })
  }
  factory.sendMessage = function(message){
    console.log(message,"sending to", factory.chatroomData, "send message factory");
    var newMessage = {
      sender: user._id,
      message: message
    }
    $http.put('/chatroom/'+factory.chatroomData._id, newMessage).success(function(){
      console.log("message updated in database")
    })

  }
  factory.closeChatroom = function(){
    console.log("closing the chat room", factory.ChatroomInfo);
    factory.chatroomInfo.sendTo = {};
    console.log(factory.ChatroomInfo);
  }
  return factory;
})
hollaApp.factory('CreateFactory', function($http, $location){
  var factory = {};
  factory.login = function(){
    $location.path('/');
  };
  factory.create = function(info, callback){
    $http.post('/users', info).success(function(res){
      console.log(res);
      if (res.status == false){
        callback(res.error);
      } else {
        //later on it will automatically logs in the user
        $location.path('/');
      }
    })
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
        factory.setUser(res.user);
        console.log("success", res.user)
        callback(res.user);
        $location.path('/main');
    } else {
      console.log("invalid user")
    }
    });
  }
  factory.newFriend = function(newFriend, callback){
    console.log("new friend addding sending the post request", newFriend)
    $http.post('/friends/new/'+user._id, newFriend).success(function(res){
      console.log("new friend adding", newFriend)
      console.log(res, "response")
      if (res.status === false){
        _this.error = res.error;
      } else {
       $location.path('/main');
        callback()
      }
    });
  }
  factory.showFriends = function(userId, callback){
    console.log("sending request to server to find firends list for user", userId);
    $http.get('/friends/'+ userId).success(function(res){
      console.log("get back the friend list", res);
      callback(res);
     // $location.path('/');
    })
  }
  factory.logout = function(callback){
    this.user = undefined
    $http.get('/killSession').success(function(res){
      console.log("killed session");
    })
    callback()
  }
  factory.getUser = function(){
    return this.user
  }
  factory.setUser = function(user){
    window.user = user;
    this.user = user;
  }
  return factory;
})