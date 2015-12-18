hollaApp.config(function($routeProvider){
	$routeProvider
	.when('/',{
		templateUrl:'views/login.html'
	})
	.when('/create',{
		templateUrl: 'views/create.html',
		controller: "createController",
		controllerAs: 'createCtrl'
	})
	.when('/main', {
		templateUrl:'views/main.html',
		controller: 'usersController',
		controllerAs: 'usersCtrl'
	})
	.when('/chatroom',{
		templateUrl:'views/chatroom.html',
		controller: 'chatroomController',
		controllerAs:'chatCtrl'
	})
	.when('/addFriend',{
		templateUrl:'views/addFriend.html'
	})
	.otherwise({
		templateUrl:'views/login.html'
	})
})