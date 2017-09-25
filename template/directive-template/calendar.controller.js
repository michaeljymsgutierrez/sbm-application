'use strict';

/* Calendar Controller */

app.controller('calendarCtrl', ['$rootScope', '$scope', 'dateFormatter', 'Modal', function($rootScope, $scope, dateFormatter, Modal) {

    /*
        Function for fetching selected date from calendar
    */
    $rootScope.$broadcast('date-picker', dateFormatter.standardNoTime(new Date($scope.datePicker)));
    $rootScope.dateChange = function() {
        $rootScope.$broadcast('date-picker', dateFormatter.standardNoTime(new Date($scope.datePicker)));
    };

    /*
        Function for calendar OK and CANCEL
    */
    $scope.calendarOk = function() {
        Modal.hide();
    };
    $scope.calendarCancel = function() {
        Modal.hide();
    };

}]);