'use strict';

/* Inventory Records Controller */

app.controller('inventoryRecordsCtrl', ['$scope', '$rootScope', 'Username', 'DBAccess', 'dateFormatter', 'Toast', 'Log', 'Transition', function($scope, $rootScope, Username, DBAccess, dateFormatter, Toast, Log, Transition) {

    Username.popup();
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
                        console.log(beginning_last + " " + actual_last + " " + count);
                        if (beginning_last == actual_last && count == 0) {
                            console.log("insert beginning");
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