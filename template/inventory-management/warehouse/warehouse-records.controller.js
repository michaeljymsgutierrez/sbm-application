'use strict';

/* Warehouse records controller */

app.controller('warehouseRecordsCtrl', ['$scope', 'Username', 'DBAccess', '$rootScope', 'Log', 'Calendar', 'dateFormatter', 'TransactionFilter', 'ModalService', 'Modal', 'ItemModal', function($scope, Username, DBAccess, $rootScope, Log, Calendar, dateFormatter, TransactionFilter, ModalService, Modal, ItemModal) {
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

    /*
        Transaction Type Filter
    */
    $rootScope.$on('filter:transaction-type', function(event, data) {
        $scope.warehouse_records = [];
        if ($scope.records.length > 0) {
            if (data == 'all') {
                $scope.warehouse_records = $scope.records;
            } else {
                angular.forEach($scope.records, function(value) {
                    if (value.type == data) {
                        $scope.warehouse_records.push(value);
                    }
                });
            }
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


    /* Filter function */
    $scope.filterBy = function() {
        TransactionFilter.show();
    };

    /* 
        Intialized Warehouse Records
    */
    $scope.initRecord = function() {
        /* Warehouse records main container */
        $scope.warehouse_records = [];
        $scope.records = [];
        var dateSelected = dateFormatter.standardNoTime($scope.warehouseRecordsSelectedDate);
        var query = "SELECT wt.id, wt.type, wt.transaction_number,(SELECT name FROM employee WHERE id = wt.created_by) AS name, status, created FROM warehouse_transaction wt WHERE DATE_FORMAT(wt.created,'%Y-%m-%d') = ?";
        DBAccess.execute(query, [dateSelected]).then(function(res) {
            $scope.warehouse_records = res;
            $scope.records = res;
            angular.forEach($scope.warehouse_records, function(value) {
                if (value.type == "order_commissary") {
                    var status = value.status;
                    value.status = status ? 'Approved' : 'Pending';
                    /*
                        Commissary Order item query
                    */
                    var tid = value.id;
                    var getItem = "SELECT wr.quantity, wr.approved_quantity, (SELECT name FROM inventory WHERE id = wr.item_id) AS item, (SELECT uom FROM inventory WHERE id = wr.item_id ) AS uom FROM warehouse_request wr WHERE wr.transaction_id = ?";
                    DBAccess.execute(getItem, [tid]).then(function(res) {
                        value.items = res;
                    }, function(err) {
                        Log.write(err);
                    });
                } else if (value.type == "commissary_delivery") {
                    var status = value.status;
                    value.status = status ? 'Completed' : 'Incomplete';
                    /*
                        Commissary Delivery item query
                    */
                    var tid = value.id;
                    var getItem = "SELECT wp.quantity, " +
                        "(SELECT name FROM inventory WHERE id = (SELECT wr.item_id FROM warehouse_request wr WHERE wr.id = wp.warehouse_request_id )) AS item, " +
                        "(SELECT uom FROM inventory WHERE id = (SELECT wr.item_id FROM warehouse_request wr WHERE wr.id = wp.warehouse_request_id )) AS uom " +
                        "FROM warehouse_response wp WHERE wp.transaction_id = ?";
                    DBAccess.execute(getItem, [tid]).then(function(res) {
                        value.items = res;
                    }, function(err) {
                        Log.write(err);
                    });

                }
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

    /*
        Function for show items by transaction
    */
    $scope.showItems = function(items) {
        ItemModal.show('./template/inventory-management/warehouse/warehouse-item.html', 'warehouseItemCtrl');
        $rootScope.warehouse_item_record = items;
    };
}]);