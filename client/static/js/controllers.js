hollaApp.controller('createController', function(CreateFactory){
  var _this = this;
  this.newUser = function(info){
    console.log(info, "creating a user with the information given", this.createInfo);
    if (this.createInfo.password !== this.createInfo.passwordV){
      this.error = "passwords does not match the varification password";
    } else {
      this.error = "passwords matches"
      CreateFactory.create(info, function(error){
        console.log(error, "there was error")
        _this.error = error;
      });
    }
  }
  this.login = function(){
    CreateFactory.login()
  }
})
  
  hollaApp.controller('loginController', function(UserFactory, socket){
    var _this = this;
    console.log("login controller on")
    // if there is session, then loggs user in
    UserFactory.session(function(){
      _this.user = UserFactory.getUser();
      console.log("session", this.user)
    });
    // it will load partial for create a  new user
    this.create = function(){
      UserFactory.create()
    }
    ////
    this.login = function(info) {
      UserFactory.logIn(info, function(res) {
        console.log("callback from log in the user",res)
        _this.user = res;
        console.log("this dot user updated", _this.user)
        // _this.showFriends(_this.user.phoneNumber, function(){
        //           console.log("emitting to socket to update socktID")
        //           socket.emit("updateSocketID", _this.user);
        // });
      });
    this.logout = function(){
      console.log("logging out");

      UserFactory.logout(function(){
        socket.disconnect();
        _this.user = undefined;
        window.location = "/";
      });
    }
    };// end of login method
    this.newUser = function(info){
      UserFactory.newUser(info, function(res){
        console.log("adding new user");
      })
    }// end of new user method
}) // end of login controller
  hollaApp.controller('usersController', function(UserFactory, socket, ChatroomFactory) {
      var _this = this;
    this.user = window.user
    console.log("controller kicks in here", this.user);

    socket.on('connect', function(){
      console.log("Socket connected")
    })
    socket.on('updateFriendList', function(data){
      console.log("a friend logged in updating friend list now", _this.user.friends);
      _this.updateFriendsList(_this.user._id, function(){
        console.log("friend list updated to ", _this.friendsList)
      })
      // _this.friendsList = _this.user.friends;
    })
    this.showFriends = function(userId){
      console.log("fetching friends for id", userId);
      UserFactory.showFriends(userId, function(res){
        console.log(res, "res");
        _this.user = res.user;
        _this.friendsList = res.user.friends
        // do something when got the firend list
        // if you use "this" here, it refers to factory, you need to refer controller
        console.log(_this.friendsList)
        _this.updateSocketId()
      })
    };
    this.updateFriendsList = function(userId){
      console.log("fetching friends for id", userId);
      UserFactory.showFriends(userId, function(res){
        console.log(res, "res");
        _this.user = res.user;
        _this.friendsList = res.user.friends
        // do something when got the firend list
        // if you use "this" here, it refers to factory, you need to refer controller
        console.log(_this.friendsList)
      })
    };
    this.showFriends(this.user._id)
    this.updateSocketId = function(){
      console.log("emitting to socket to update socktID", this.user)
      socket.emit("updateSocketID", this.user);
    }
    this.startChat = function(friend){
      console.log(friend);
      ChatroomFactory.startChatroom(friend, function(res){
        console.log('starting the chat with', friend);
      })
      socket.emit("startedChat", friend)
    }
    this.addFriend = function(){
      console.log("new friend adding from controller triggered", this.newFriend)
      UserFactory.newFriend(this.newFriend, function(){
        // do something when added friend like 
        // refreshing the friend list.
        console.log(this.user, "showfing friends with uer")
      _this.showFriends(this.user._id);

      })
      this.newFriend = {};
    };
    // this.getFriendListByUserName = function(userName){
    // }
  })
hollaApp.controller('chatroomController', function(ChatroomFactory, UserFactory, socket){
  //controller for chat room
  var _this = this
  console.log(ChatroomFactory.chatroomInfo);
  this.chatroomInfo = ChatroomFactory.chatroomInfo;
  this.conversation = [''];
  socket.on('message', function(message){
    console.log("message", message);
    message.from = "friend";
    message.name = _this.chatroomInfo.sendTo.name;
    _this.conversation.push(message)
    console.log(_this.conversation);
  })
  this.test = "dsfdf";
  this.getChatData = function(){
    _this.conversation = ChatroomFactory.chatroomData.messages;
    for (idx = 0 ; idx < _this.conversation.length ; idx++){
      if (_this.conversation[idx].sender == user._id){
        _this.conversation[idx].from = "self";
        _this.conversation[idx].name = _this.chatroomInfo.sentFrom.name;
      } else {
        _this.conversation[idx].from = "friend";
        _this.conversation[idx].name = _this.chatroomInfo.sendTo.name;
      }
    }
    console.log(_this.conversation, user._id)
  }
  this.getChatData()
  this.sendMessage = function(){
    console.log(this.message);
    console.log(ChatroomFactory.chatroomInfo);
    ChatroomFactory.sendMessage(this.message, function(res){
    });
    this.message.sendTo = ChatroomFactory.sendTo
    var messageData = {
      message: this.message,
      sendTo: _this.chatroomInfo.sendTo,
      sentFrom: _this.chatroomInfo.sentFrom
    }
    socket.emit("sendMessageToServer", messageData)
    messageData.from = "self";
    messageData.name = _this.chatroomInfo.sentFrom.name;
    _this.conversation.push(messageData);
    this.message = "";
  }
})

