'use strict';

/* Inventory Actual Controller */

app.controller('inventoryActualCtrl', ['$scope', '$rootScope', 'Username', '$http', 'DBAccess', 'Log', 'dateFormatter', 'Toast', '$timeout', function($scope, $rootScope, Username, $http, DBAccess, Log, dateFormatter, Toast, $timeout) {

    Username.popup();
    /* Initialize invetory actual items container */
    $scope.inventory_actual = [];
    var unregisterUser = $rootScope.$on('user', function(event, data) {
        unregisterUser();
        /* Employee ID */
        $scope.eid = data.id
        var query = "SELECT id, name AS item, category_name AS category ,uom FROM inventory WHERE status = 1";
        DBAccess.execute(query, []).then(function(res) {
            /* Contain items to be actual */
            $scope.inventory_actual = res;
        }, function(err) {
            Log.write(err);
        });
    });

    /* 
        Function for saving inventory actual  
    */
    $scope.save_inventory_actual = function() {
        /*
            Check item inputs for actual
        */
        var qty_checker = 0;
        angular.forEach($scope.inventory_actual, function(value) {
            if (value.qty == "") {
                qty_checker++;
            }
        });
        if (qty_checker > 0) {
            Toast.show("Add actual on each items");
        } else {
            var query = "SELECT DATE_FORMAT(max(created), '%Y-%m-%d') AS beginning_last, (SELECT DATE_FORMAT(max(created),'%Y-%m-%d') FROM inventory_actual) AS actual_last FROM inventory_beginning";
            DBAccess.execute(query, []).then(function(res) {
                    if (res.length != 0) {
                        var beginning_last = res[0].beginning_last;
                        var actual_last = res[0].actual_last;
                        var datenow = dateFormatter.standardNoTime(new Date);

                        if ($rootScope.inventory_status == "Incomplete Actual") {
                            var datelast = beginning_last + " 15:59:00";
                            angular.forEach($scope.inventory_actual, function(value) {
                                /* Insert inventory actual */
                                var insertInventoryActual = "INSERT INTO inventory_actual (inventory_id, qty, created_by, created, is_synced) VALUES (?,?,?,?,?)";
                                var paramInventoryActual = [value.id, value.qty, $scope.eid, datelast, 0];
                                DBAccess.execute(insertInventoryActual, paramInventoryActual);
                            });
                            Toast.show("Saving inventory actual transaction successful");
                            $timeout(function() {
                                angular.forEach($scope.inventory_actual, function(value) {
                                    /* Insert inventory beginning */
                                    var insertInventoryBeginning = "INSERT INTO inventory_beginning (inventory_id, qty, created_by, created, is_synced) VALUES (?,?,?,?,?)";
                                    var paramInventoryBeginning = [value.id, value.qty, $scope.eid, dateFormatter.utc(new Date()), 0];
                                    DBAccess.execute(insertInventoryBeginning, paramInventoryBeginning);
                                });
                                Toast.show("Started  inventory: " + datenow);
                            }, 5000);
                            $rootScope.inventory_status = "";
                        } else {
                            Toast.show('update actual');
                        }
                    }
                },
                function(err) {
                    Log.write(err);
                });
        }
    };
}]);