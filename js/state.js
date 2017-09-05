'use strict';

// States and Configurations
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('setup', {
            url: '/setup',
            templateUrl: './template/initial-setup/initial-setup.html',
            controller: 'setupCtrl'
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: './template/dashboard/dashboard.html',
            controller: 'dashboardCtrl'
        })
        .state('employee-home', {
            url: '/employee-home',
            templateUrl: './template/employee-management/employee-home.html'
        })
        .state('attendance', {
            url: '/attendance',
            templateUrl: './template/employee-management/attendance.html',
            controller: 'attendanceCtrl'
        })
        .state('schedule', {
            url: '/schedule',
            templateUrl: './template/employee-management/schedule.html',
            controller: 'scheduleCtrl'
        })
        .state('settings', {
            url: '/settings',
            templateUrl: './template/settings/settings.html',
            controller: 'settingsCtrl'
        })
        .state('sync', {
            url: '/sync',
            templateUrl: './template/sync/sync.html',
            controller: 'syncCtrl'
        });

    // $urlRouterProvider.otherwise('/dashboard');
    $urlRouterProvider.otherwise('/attendance');
}]);