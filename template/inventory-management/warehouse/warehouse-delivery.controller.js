'use strict';

/*
    Warehouse Delivery Controller
*/

app.controller('warehouseDeliveryCtrl', ['$scope', 'DBAccess', 'Username', '$rootScope', 'Toast', 'Log', 'dateFormatter', function($scope, DBAccess, Username, $rootScope, Toast, Log, dateFormatter) {

    Username.popup();
    /*
        Initialize order delivery scopes
    */
    $scope.initOrderDelivery = function() {
        $scope.order_no = "";
        $scope.delivery_no = "";
        $scope.order_delivery_item = [];
    };
    $scope.initOrderDelivery();
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
                            var query = "SELECT wr.id, wr.item_id, wr.quantity, wr.approved_quantity, " +
                                "(SELECT wp.quantity FROM warehouse_response wp WHERE wp.warehouse_request_id = wr.id) AS delivered," +
                                "(SELECT wp.transaction_id FROM warehouse_response wp WHERE wp.warehouse_request_id = wr.id) AS delivery_no," +
                                "(SELECT wt.transaction_number FROM warehouse_transaction wt WHERE wt.id = delivery_no) AS transaction_number, " +
                                "(SELECT name FROM inventory WHERE id = wr.item_id) AS item, " +
                                "(SELECT uom FROM inventory WHERE id = wr.item_id) AS uom, " +
                                "(SELECT category_name FROM inventory WHERE id = wr.item_id) AS category " +
                                "FROM warehouse_request wr WHERE wr.transaction_id = ?";
                            DBAccess.execute(query, [$scope.transactionId]).then(function(res) {
                                /*
                                    Break Point
                                */
                                $scope.delivery_no = res[0].transaction_number;
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
                            /*
                                Check if one of the item id exists on warehouse response
                            */
                            var query = "SELECT * FROM warehouse_response WHERE warehouse_request_id = ?";
                            var param = [$scope.order_delivery_item[0].id];
                            DBAccess.execute(query, param).then(function(res) {
                                if (res.length == 0) {
                                    /*
                                        Insert warehouse transaction and response
                                        Warehouse Delivery
                                    */
                                    var insertWarehouseTransaction = "INSERT INTO warehouse_transaction (type, transaction_number, created_by, status, created, is_synced) VALUES (?,?,?,?,?,?)";
                                    var param = ['commissary_delivery', $scope.delivery_no, $scope.user.id, 0, dateFormatter.utc(new Date()), 0];
                                    DBAccess.execute(insertWarehouseTransaction, param).then(function(res) {
                                        var tid = res.insertId;
                                        angular.forEach($scope.order_delivery_item, function(value) {
                                            var insertWarehouseResponse = "INSERT INTO warehouse_response (warehouse_request_id, quantity, transaction_id) VALUES (?,?,?)";
                                            var param = [value.id, parseInt(value.delivered), tid];
                                            DBAccess.execute(insertWarehouseResponse, param);
                                        });
                                        Toast.show("Warehouse delivery transaction successful");
                                        $scope.initOrderDelivery();
                                    }, function(err) {
                                        Log.write(err);
                                    });
                                } else {
                                    /* Get transaction id from warehouse response query for update */
                                    $scope.result = res[0].transaction_id;
                                    /*
                                        Update warehouse transaction and response
                                        Warehouse Delivery
                                    */
                                    var updateWarehouseTransaction = "UPDATE warehouse_transaction SET transaction_number = ? WHERE id = ?";
                                    var param = [$scope.delivery_no, $scope.result];
                                    DBAccess.execute(updateWarehouseTransaction, param).then(function(res) {
                                        angular.forEach($scope.order_delivery_item, function(value) {
                                            var updateWarehouseResponse = "UPDATE warehouse_response SET quantity = ? WHERE warehouse_request_id = ? AND transaction_id = ?";
                                            var param = [parseInt(value.delivered), value.id, $scope.result];
                                            DBAccess.execute(updateWarehouseResponse, param);
                                            Toast.show("Updating warehouse delivery transaction successful");
                                            $scope.initOrderDelivery();
                                        });
                                    }, function(err) {
                                        Log.write(err);
                                    });
                                }
                            }, function(err) {
                                Log.write(err);
                            });
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