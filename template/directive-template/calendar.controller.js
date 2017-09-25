'use strict';

/* Calendar Controller */

app.controller('calendarCtrl', ['$rootScope', '$scope', 'dateFormatter', function($rootScope, $scope, dateFormatter) {

    /*
        Function for fetching selected date from calendar
    */
    $rootScope.dateChange = function() {
        $rootScope.selecteDate = dateFormatter.standardNoTime(new Date($scope.datePicker));
    };

}]);