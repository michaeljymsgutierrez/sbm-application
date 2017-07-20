'use strict';

// States and Configurations
app.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
	.state('home',{
		url: '/home',
		templateUrl: './template/home/home.html'
	})
	.state('employee-home',{
		url: '/employee-home',
		templateUrl: './template/employee-management/employee-home.html'
	});

	$urlRouterProvider.otherwise('/home');
});