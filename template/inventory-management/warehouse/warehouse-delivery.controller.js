'use strict';

/*
    Warehouse Delivery Controller
*/

app.controller('warehouseDeliveryCtrl', ['$scope', 'DBAccess', 'Username', '$rootScope', 'Toast', 'Log', function($scope, DBAccess, Username, $rootScope, Toast, Log) {

    Username.popup();
    /*
        Initialize scopes
    */
    $scope.order_no = "";
    $scope.delivery_no = "";
    var unregisterUser = $rootScope.$on('user', function(event, data) {
        unregisterUser();
        $scope.user = data;

        /*
            Function for search transaction number
        */
        $scope.searchTransaction = function() {
            if ($scope.order_no != "") {
                var query = "SELECT * FROM warehouse_transaction WHERE transaction_number = ?";
                DBAccess.execute(query, [$scope.order_no]).then(function(res) {
                    if (res[0].is_synced == 0) {
                        Toast.show("Warehouse transaction is unsynced");
                    } else if (res[0].status == 0) {
                        Toast.show("Warehouse transaction is waiting for approval");
                    } else {
                        console.log(res);
                    }
                }, function(err) {
                    Log.write(err);
                });
            } else {
                Toast.show("Please input order no");
            }
        };

    });
}]);