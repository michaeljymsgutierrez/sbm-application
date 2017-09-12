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
        .state('inventory-home', {
            url: '/inventory-home',
            templateUrl: './template/inventory-management/inventory-home.html'
        })
        .state('inventory-records', {
            url: '/inventory-records',
            templateUrl: './template/inventory-management/inventory-records.html'
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

    /* 
        Define what route should the application will be redirected 
        Unfortunately angular config do not accept factories and services
    */
    if (JSON.parse(window.localStorage.getItem('setup')) == 'complete') {
        $urlRouterProvider.otherwise('/dashboard');
    } else {
        $urlRouterProvider.otherwise('/setup');
    }

}]);