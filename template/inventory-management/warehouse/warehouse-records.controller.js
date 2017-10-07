'use strict';

/* Warehouse records controller */

app.controller('warehouseRecordsCtrl', ['$scope', 'Username', 'DBAccess', '$rootScope', 'Log', 'Calendar', 'dateFormatter', function($scope, Username, DBAccess, $rootScope, Log, Calendar, dateFormatter) {
    Username.popup();

    $scope.warehouseRecordsSelectedDate = new Date();
    /* 
        Function  for calendar popup
        And listener for date changes
    */
    $scope.calendarPopup = function() {
        Calendar.popup();
    };

    $rootScope.$on('date-picker', function(event, data) {
        if (data) {
            $scope.warehouseRecordsSelectedDate = new Date(data);
            $scope.initRecord();
        }
    });

    /* Previous date filter */
    $scope.previous = function() {
        var prevDate = dateFormatter.timestamp($scope.warehouseRecordsSelectedDate) - 86400;
        $scope.warehouseRecordsSelectedDate = dateFormatter.standardNoTime(dateFormatter.fromTimestamp(prevDate));
        $scope.initRecord();
    };

    /* Next date filter */
    $scope.next = function() {
        var nextDate = dateFormatter.timestamp($scope.warehouseRecordsSelectedDate) + 86400;
        $scope.warehouseRecordsSelectedDate = dateFormatter.standardNoTime(dateFormatter.fromTimestamp(nextDate));
        $scope.initRecord();
    };

    /* 
        Intialized Warehouse Records
    */
    $scope.initRecord = function() {
        /* Warehouse records main container */
        $scope.warehouse_records = [];
        var dateSelected = dateFormatter.standardNoTime($scope.warehouseRecordsSelectedDate);
        var query = "SELECT wt.id, wt.type, wt.transaction_number,(SELECT name FROM employee WHERE id = wt.created_by) AS name, status, created FROM warehouse_transaction wt WHERE DATE_FORMAT(wt.created,'%Y-%m-%d') = ?";
        DBAccess.execute(query, [dateSelected]).then(function(res) {
            $scope.warehouse_records = res;
            angular.forEach($scope.warehouse_records, function(value) {
                console.log(value);
            });
        }, function(err) {
            Log.write(err);
        });
    };

    $scope.initRecord();

    var unregisteUser = $rootScope.$on('user', function(event, data) {
        unregisteUser();
        $scope.user = data;
    });
}]);