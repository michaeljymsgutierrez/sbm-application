'use strict';

// States and Configurations
app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('setup', {
            url: '/setup',
            templateUrl: './template/initial-setup/initial-setup.html',
            controller: 'setupCtrl'
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: './template/dashboard/dashboard.html'
        })
        .state('employee-home', {
            url: '/employee-home',
            templateUrl: './template/employee-management/employee-home.html'
        })
        .state('settings', {
            url: '/settings',
            templateUrl: './template/settings/settings.html'
        });

    // $urlRouterProvider.otherwise('/dashboard');
    $urlRouterProvider.otherwise('/setup');
});