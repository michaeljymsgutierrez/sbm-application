'use strict';

/* Custom Directives */

/* Sidebar Menu */
app.directive('sideMenuBar', function() {
    return {
        restrict: 'E',
        templateUrl: './template/directive-template/side-menu-bar.html'
    }
});

/* One space */
app.directive('spO', function() {
    return {
        restrict: 'E',
        template: '&nbsp;'
    }
});

/* Two space */
app.directive('spT', function() {
    return {
        restrict: 'E',
        template: '&nbsp;&nbsp;'
    }
});

/* Four space */
app.directive('spF', function() {
    return {
        restrict: 'E',
        template: '&nbsp;&nbsp;&nbsp;&nbsp;'
    }
});

/* Logo */
app.directive('mainLogo', function() {
    return {
        restrict: 'E',
        template: '<img src="./img/default_logo.png" class="home-logo" />'
    }
});