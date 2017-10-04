'use strict';

/* Warehouse records controller */

app.controller('warehouseRecordsCtrl', ['$scope', 'Username', 'DBAccess', '$rootScope', 'Log', function($scope, Username, DBAccess, $rootScope, Log) {
    Username.popup();

    var unregisteUser = $rootScope.$on('user', function(event, data) {
        unregisteUser();
        $scope.user = data;
        /* Warehouse records main container */
        $scope.warehouse_records = [];
        var query = "SELECT wt.id, wt.type, wt.transaction_number,(SELECT name FROM employee WHERE id = wt.created_by) AS name, status, created FROM warehouse_transaction wt";
        DBAccess.execute(query, []).then(function(res) {
            console.log(res);
            $scope.warehouse_records = res;
        }, function() {
            Log.write(err);
        });
    });
}]);