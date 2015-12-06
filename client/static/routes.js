hollaApp.config(function($routeProvider){
	$routeProvider
	.when('/',{
		templateUrl:'views/login.html'
	})
	.when('/main',{
		templateUrl:'views/main.html'
	})
	.when('/chatroom',{
		templateUrl:'views/chatroom.html',
		controller: 'chatroomController',
		controllerAs:'chatCtrl'
	})
	.otherwise({
		templateUrl:'views/login.html'
	})
	
})