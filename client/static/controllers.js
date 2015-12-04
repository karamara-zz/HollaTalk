
  hollaApp.controller('usersController', function(UserFactory) {
    console.log("controller kicks in here")


    this.friendsList = ["sdfasd"]
    var _this = this;
    this.chatRoomStatus = false;
    this.user = {name: "sung",
    phoneNumber : 3107453637}
    var self = this
    this.addUser = function() {
      console.log("add friends", this.newUser)
      UserFactory.addUser(this.newUser, function(friends) {
        // console.log("added friedns")
      });
      this.newUser = {};
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
      _this.chatRoomStatus = true;
    }
    this.addFriend = function(){
      console.log("new friend adding from controller triggered", this.newFriend)
      var friendAdding = this.user;
      friendAdding.friendPhoneNumber = this.newFriend.phoneNumber
      UserFactory.newFriend(friendAdding, function(){
        // do something when added friend like refreshing the friend list.
      })
      this.newFriend = {};
    };
    // this.getFriendListByUserName = function(userName){
    // }
    this.showFriends(this.user.phoneNumber);
  })
