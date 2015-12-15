hollaApp.config(function($routeProvider){
	$routeProvider
	.when('/',{
		templateUrl:'views/main.html'
	})
	// .when('/main',{
	// 	templateUrl:'views/main.html'
	// })
	.when('/chatroom',{
		templateUrl:'views/chatroom.html',
		controller: 'chatroomController',
		controllerAs:'chatCtrl'
	})
	.when('/addFriend',{
		templateUrl:'views/addFriend.html'
	})
	.otherwise({
		templateUrl:'views/main.html'
	})
})