
  hollaApp.controller('usersController', function(UserFactory) {
    console.log("controller kicks in here")
    this.friends = []
    var self = this
    this.addUser = function() {
      console.log("add friends", this.newUser)
      UserFactory.addUser(this.newUser, function(friends) {
        console.log("added friedns")
      });
      this.newUser = {};
    }
  })