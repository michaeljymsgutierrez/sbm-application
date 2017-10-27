'use strict';

/* Inventory Records Controller */

app.controller('inventoryRecordsCtrl', ['$scope', '$rootScope', 'Username', 'DBAccess', 'dateFormatter', 'Toast', 'Log', 'Transition', 'Calendar', function($scope, $rootScope, Username, DBAccess, dateFormatter, Toast, Log, Transition, Calendar) {

    Username.popup();
    /*
        Date Filter Function start here
        Initialize date picker for selected date on inventory and datePicker listener
        Next and Previous date selector
    */
    $scope.inventoryRecordsSelectedDate = new Date();
    $scope.initRecord = function() {
        $scope.dateSelected = dateFormatter.standardNoTime($scope.inventoryRecordsSelectedDate);
        $scope.inventory_records = [];
        var query = "SELECT i.id, i.name AS item, i.category_name AS category, i.uom AS uom ," +
            "IFNULL((SELECT qty FROM inventory_beginning WHERE inventory_id = i.id AND DATE_FORMAT(created,'%Y-%m-%d') = ?),0) AS beginning, " +
            "(0) AS delivery, " +
            "(0) AS pullout, " +
            "(0) AS transin, " +
            "(0) AS transout, " +
            "(0) AS sales, " +
            "IFNULL((SELECT SUM(qty) FROM inventory_waste WHERE inventory_id = i.id AND DATE_FORMAT(created,'%Y-%m-%d') =?),0) AS wastage, " +
            "(SELECT (beginning - wastage)) AS ending, " +
            "IFNULL((SELECT qty FROM inventory_actual WHERE inventory_id = i.id AND DATE_FORMAT(created,'%Y-%m-%d') = ?),0) AS actual " +
            " FROM inventory i  WHERE status = 1";
        DBAccess.execute(query, [$scope.dateSelected, $scope.dateSelected, $scope.dateSelected]).then(function(res) {
            $scope.inventory_records = res;
            /*
                Get Delivery Item quantity
            */
            console.log($scope.inventory_records);
            var getDelivery = "SELECT wt.id FROM warehouse_transaction wt WHERE DATE_FORMAT(created,'%Y-%m-%d') = ? AND type = 'commissary_delivery'";
            var param = [$scope.dateSelected];
            DBAccess.execute(getDelivery, param).then(function(res) {
                console.log(res);
            }, function(err) {
                Log.write(err);
            });
        }, function(err) {
            Log.write(err);
        });
    };

    $scope.initRecord();

    $rootScope.$on('date-picker', function(event, data) {
        if (data) {
            $scope.inventoryRecordsSelectedDate = new Date(data);
            $scope.initRecord();
        }
    });

    /* Previous date filter */
    $scope.previous = function() {
        var prevDate = dateFormatter.timestamp($scope.inventoryRecordsSelectedDate) - 86400;
        $scope.inventoryRecordsSelectedDate = dateFormatter.standardNoTime(dateFormatter.fromTimestamp(prevDate));
        $scope.initRecord();
    };

    /* Next date filter */
    $scope.next = function() {
        var nextDate = dateFormatter.timestamp($scope.inventoryRecordsSelectedDate) + 86400;
        $scope.inventoryRecordsSelectedDate = dateFormatter.standardNoTime(dateFormatter.fromTimestamp(nextDate));
        $scope.initRecord();
    };

    /* Function  for calendar popup*/
    $scope.calendarPopup = function() {
        Calendar.popup();
    };
    /*
        Date Filter Function end here
    */

    var unregisterUser = $rootScope.$on('user', function(event, data) {
        unregisterUser();
        /* Employee ID */
        var eid = data.id;
        DBAccess.execute("SELECT * FROM inventory_beginning", []).then(function(res) {
            /*
                Insert item from inventory to inventory_beginning
                Initial Setup
            */
            if (res.length == 0) {
                /* 
                    Get initial item and quantity from inventory 
                */
                var query = "SELECT id, initial_qty FROM inventory";
                DBAccess.execute(query, []).then(function(res) {
                    if (res.length != 0) {
                        angular.forEach(res, function(value) {
                            var insertInventoryBeginning = "INSERT INTO inventory_beginning (inventory_id, qty, created_by, created, is_synced) VALUES (?,?,?,?,?)";
                            var param = [value.id, value.initial_qty, eid, dateFormatter.utc(new Date()), 0];
                            DBAccess.execute(insertInventoryBeginning, param);
                        });
                        Toast.show("Started inventory: " + dateFormatter.standardNoTime(new Date()));
                    }
                }, function(err) {
                    Log.write(err);
                });
            } else {
                var datenow = dateFormatter.standardNoTime(new Date());
                /*
                    Get last entry from beginning and actual
                */
                var query = "SELECT DATE_FORMAT(max(created), '%Y-%m-%d') AS beginning_last, (SELECT DATE_FORMAT(max(created),'%Y-%m-%d') FROM inventory_actual) AS actual_last FROM inventory_beginning";
                DBAccess.execute(query, []).then(function(res) {
                    /* Beginning and Actual Last Entry */
                    var actual_last = res[0].actual_last;
                    var beginning_last = res[0].beginning_last;
                    /*
                        Check if current date is exisiting
                        on inventory_beginning
                    */
                    var query = "SELECT count(*) AS count FROM inventory_beginning WHERE DATE_FORMAT(created,'%Y-%m-%d') = ?";
                    DBAccess.execute(query, [datenow]).then(function(res) {
                        var count = res[0].count;
                        if (beginning_last == actual_last && count == 0) {
                            var query = "SELECT inventory_id , qty FROM inventory_actual WHERE DATE_FORMAT(created,'%Y-%m-%d') = ?";
                            DBAccess.execute(query, [actual_last]).then(function(res) {
                                angular.forEach(res, function(value) {
                                    var insertInventoryBeginning = "INSERT INTO inventory_beginning (inventory_id, qty, created_by, created, is_synced) VALUES (?,?,?,?,?)";
                                    var param = [value.inventory_id, value.qty, eid, dateFormatter.utc(new Date()), 0];
                                    DBAccess.execute(insertInventoryBeginning, param);
                                });
                                Toast.show("Started inventory: " + dateFormatter.standardNoTime(new Date()));
                                $scope.status = "Complete Beginning";
                            }, function(err) {
                                Log.write(err);
                            });
                        } else if (beginning_last != actual_last && count == 0) {
                            Toast.show("Need to end inventory on: " + beginning_last);
                            $rootScope.inventory_status = "Incomplete Actual";
                            Transition.go('inventory-actual');
                        } else {
                            $scope.status = "Complete Beginning";
                            console.log("OK");
                        }
                    }, function(err) {
                        Log.write(err);
                    });
                }, function(err) {
                    Log.write(err);
                });

            }
        }, function(err) {
            Log.write(err);
        });
    });

}]);