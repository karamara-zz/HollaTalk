
  hollaApp.controller('usersController', function(UserFactory, socket, ChatroomFactory) {
    console.log("controller kicks in here")
    this.friendsList;
    var _this = this;
    ///////temporary place holder value for testing
    this.newUser = {
      name: "sung",
      phoneNumber: 3107453637
    };
    ////
    this.chatRoomStatus = false;
    var self = this
    socket.on('connect', function(data){
      console.log("connected", socket.id)
    })
    socket.on('updateFriendList', function(data){
      console.log("a friend logged in updating friend list now", _this.user.friends);
      _this.showFriends(_this.user.phoneNumber, function(){
        console.log("friend list updated to ", _this.friendsList)
      })
      // _this.friendsList = _this.user.friends;


    })
    this.login = function() {
      this.user = this.newUser
      console.log("add user", this.user)
      UserFactory.logIn(this.user
        , function(res) {
        console.log("fdsfadfdsfsdfdsf",res)
        _this.user = res;
        console.log("this dot user updated", _this.user)
        user = res;
        _this.showFriends(_this.user.phoneNumber, function(){
                  console.log("emitting to socket to update socktID")
                  socket.emit("updateSocketID", _this.user);
        });

      });
    };
    this.showFriends = function(user, callback){
      console.log("fetching friends for ", user);
      UserFactory.showFriends(user, function(res){
        console.log(res);
        _this.user = res
        _this.friendsList = res.friends
        // do something when got the firend list
        // if you use "this" here, it refers to factory, you need to refer controller
        console.log(_this.friendsList)
        callback();
      })
    };
    this.startChat = function(friend){
      console.log(friend);
      ChatroomFactory.startChatroom(friend, function(res){
        console.log('starting the chat with', friend)
        if (friend.cSocketID){
          ChatroomFactory.sendTo = friend.cSocketID
        }
      })
      socket.emit("startedChat", friend)
    }
    this.addFriend = function(){
      console.log("new friend adding from controller triggered", this.newFriend)
      var friendAdding = this.user;
      friendAdding.friendPhoneNumber = this.newFriend.phoneNumber
      UserFactory.newFriend(friendAdding, function(){
        // do something when added friend like 
        // refreshing the friend list.
        console.log(this.user, "showfing friends with uer")
      _this.showFriends(this.user.phoneNumber);

      })
      this.newFriend = {};
    };
    // this.getFriendListByUserName = function(userName){
    // }
  })
hollaApp.controller('chatroomController', function(ChatroomFactory, socket){
  //controller for chat room
  var _this = this
  this.conversation = [''];
  socket.on('message', function(message){
    console.log("message", message);
    message.from = "friend";
    _this.conversation.push(message)
    console.log(_this.conversation);
  })
  this.test = "dsfdf";
  this.sendMessage = function(){
    console.log(this.message);
    ChatroomFactory.sendMessage(this.message, function(res){
    });
    this.message.sendTo = ChatroomFactory.sendTo
    var messageData = {
      message: this.message,
      sendTo: ChatroomFactory.sendTo,
      sentFrom: user.cSocketID
    }
    socket.emit("sendMessageToServer", messageData)
    messageData.from = "self";
    _this.conversation.push(messageData);
    this.message = "";
  }
})
