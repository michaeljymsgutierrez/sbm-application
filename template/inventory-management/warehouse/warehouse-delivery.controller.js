'use strict';

/*
    Warehouse Delivery Controller
*/

app.controller('warehouseDeliveryCtrl', ['$scope', 'DBAccess', 'Username', '$rootScope', 'Toast', 'Log', 'dateFormatter', function($scope, DBAccess, Username, $rootScope, Toast, Log, dateFormatter) {

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
                var query = "SELECT * FROM warehouse_transaction WHERE transaction_number = ? AND type = ?";
                DBAccess.execute(query, [$scope.order_no, 'order_commissary']).then(function(res) {
                    /*
                        Fetch warehouse transaction data 
                    */
                    $scope.warehouseTransaction = res[0];
                    if (res.length != 0) {
                        if (res[0].is_synced == 0) {
                            Toast.show("Warehouse transaction is unsynced");
                        } else if (res[0].status == 0) {
                            Toast.show("Warehouse transaction is waiting for approval");
                        } else {
                            /* Transaction ID for order delivery items */
                            $scope.transactionId = res[0].id;
                            var query = "SELECT wr.id, wr.item_id, wr.quantity, wr.approved_quantity, (SELECT name FROM inventory WHERE id = wr.item_id) AS item, (SELECT uom FROM inventory WHERE id = wr.item_id) AS uom, (SELECT category_name FROM inventory WHERE id = wr.item_id) AS category FROM warehouse_request wr WHERE wr.transaction_id = ?";
                            DBAccess.execute(query, [$scope.transactionId]).then(function(res) {
                                /*
                                    Break Point
                                */
                                $scope.order_delivery_item = res;
                            }, function(err) {
                                Log.write(err);
                            });
                        }
                    } else {
                        Toast.show("Invalid warehouse transaction number");
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
            if ($scope.order_delivery_item.length == 0) {
                Toast.show("Please select transaction first");
            } else {
                /*
                    Initialize quantity checker for items
                */
                $scope.checkQuantity = 0;
                $scope.itemLength = $scope.order_delivery_item.length;

                angular.forEach($scope.order_delivery_item, function(value) {
                    if (value.delivered != "") {
                        $scope.checkQuantity++;
                    }
                });

                $scope.$watch('checkQuantity', function(value) {
                    if ($scope.checkQuantity == $scope.itemLength) {
                        if ($scope.delivery_no != "") {
                            var query = ""
                        } else {
                            Toast.show("Please input delivery number");
                        }
                    } else {
                        Toast.show("Please input delivered quantity");
                    }
                });
            }
        };

    });
}]);