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
    $scope.order_delivery_item = [];
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
                    if (res.length != 0) {
                        if (res[0].is_synced == 0) {
                            Toast.show("Warehouse transaction is unsynced");
                        } else if (res[0].status == 0) {
                            Toast.show("Warehouse transaction is waiting for approval");
                        } else {
                            /* Transaction ID for order delivery items */
                            var tid = res[0].id;
                            var query = "SELECT wr.item_id, wr.quantity, wr.approved_quantity, (SELECT name FROM inventory WHERE id = wr.item_id) AS item, (SELECT uom FROM inventory WHERE id = wr.item_id) AS uom, (SELECT category_name FROM inventory WHERE id = wr.item_id) AS category FROM warehouse_request wr WHERE wr.transaction_id = ?";
                            DBAccess.execute(query, [tid]).then(function(res) {
                                $scope.order_delivery_item = res;
                            }, function(err) {
                                Log.write(err);
                            });
                        }
                    } else {
                        Toast.show("Invalid wrehouse transaction number");
                    }
                }, function(err) {
                    Log.write(err);
                });
            } else {
                Toast.show("Please input order no");
            }
        };

        /*
            Function for saving delivery transaction
        */
        $scope.saveDelivery = function() {
            console.log($scope.order_delivery_item);
        };

    });
}]);