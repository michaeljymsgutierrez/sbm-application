'use strict';

// States and Configurations
app.config(function($stateProvider, $urlRouterProvider){

	$stateProvider
	.state('dashboard',{
		url: '/dashboard',
		templateUrl: './template/dashboard/dashboard.html'
	})
	.state('employee-home',{
		url: '/employee-home',
		templateUrl: './template/employee-management/employee-home.html'
	});

	$urlRouterProvider.otherwise('/dashboard');
});