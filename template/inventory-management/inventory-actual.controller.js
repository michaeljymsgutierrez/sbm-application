'use strict';

/* Inventory Actual Controller */

app.controller('inventoryActualCtrl', ['$scope', '$rootScope', 'Username', '$http', 'DBAccess', 'Log', function($scope, $rootScope, Username, $http, DBAccess, Log) {

    Username.popup();
    /* Initialize invetory actual items container */
    $scope.inventory_actual = [];
    var unregisterUser = $rootScope.$on('user', function(event, data) {
        unregisterUser();
        /* Employee ID */
        var eid = data.id
        var query = "SELECT DATE_FORMAT(max(created),'%Y-%m-%d') AS beginning_last FROM inventory_beginning";
        DBAccess.execute(query, []).then(function(res) {
            if (res.length != 0) {
                var beginning_last = res[0].beginning_last;
                var query = "SELECT id, name AS item, category_name AS category ,uom FROM inventory WHERE status = 1";
                DBAccess.execute(query, []).then(function(res) {
                    /* Contain items to be actual */
                    $scope.inventory_actual = res;
                }, function(err) {
                    Log.write(err);
                });
            }
        }, function(err) {
            Log.write(err);
        });
    });

    /* 
        Function for saving inventory actual  
    */
    $scope.save_inventory_actual = function() {
        console.log("Save inventory actual")
    };
}]);