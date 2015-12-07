
  hollaApp.controller('usersController', function(UserFactory, socket, ChatroomFactory) {
    console.log("controller kicks in here")
    this.friendsList;
    var _this = this;
    ///////temporary place holder value for testing
    this.newUser = {
      name: "sung",
      phoneNumber: 3107453637
    }
    ////
    this.chatRoomStatus = false;
    var self = this
    console.log("socket")
    socket.on('connect', function(data){
      console.log("connected", socket.id)
    })
    socket.on('receiver', function(data){
      console.log("emit", data)
    })
    this.login = function() {
      this.user = this.newUser
      user = this.user
      console.log("add user", this.user)
      UserFactory.logIn(this.user, function(res) {
        console.log("added friedns")
        _this.user = res;
        _this.showFriends(_this.user.phoneNumber);
        socket.emit("updateSocketID", res);
      });
    };
    this.showFriends = function(user){
      console.log("fetching friends for ", user);
      UserFactory.showFriends(user, function(res){
        console.log(res);
        _this.friendsList = res.friends
        // do something when got the firend list
        // if you use "this" here, it refers to factory, you need to refer controller
        console.log(_this.friendsList)
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
  this.test = "dsfdf";
  this.sendMessage = function(){
    console.log(this.message);
    ChatroomFactory.sendMessage(this.message, function(res){
      console.log("went to factory")
    })
    this.message = "";
  }
  console.log()
})
