'use strict';

/* Custom Directives */

/* Sidebar Menu */
app.directive('sideMenuBar', function() {
    return {
        restrict: 'E',
        templateUrl: './template/directive-template/side-menu-bar.html'
    };
});

/* One space */
app.directive('spO', function() {
    return {
        restrict: 'E',
        template: '&nbsp;'
    };
});

/* Two space */
app.directive('spT', function() {
    return {
        restrict: 'E',
        template: '&nbsp;&nbsp;'
    };
});

/* Four space */
app.directive('spF', function() {
    return {
        restrict: 'E',
        template: '&nbsp;&nbsp;&nbsp;&nbsp;'
    };
});

/* Logo */
app.directive('mainLogo', function() {
    return {
        restrict: 'E',
        template: '<img src="./img/colored-logo.png" class="home-logo" style="height:178px;width:380px;"/>'
    };
});

app.directive('pad', function() {
    return {
        restrict: 'E',
        template: '<div style="width: 10px; height: 500px"></div>'
    };
});

app.directive('validNumber', function() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            scope.$watch(attrs.ngModel, function(val) {
                if (val < 0) {
                    ngModel.$setViewValue('');
                    ngModel.$render();
                } else if (isNaN(val) == true) {
                    ngModel.$setViewValue('');
                    ngModel.$render();
                }
            });
        }
    }
})