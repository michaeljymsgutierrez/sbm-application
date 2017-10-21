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
                            var tid = res[0].id;
                            var query = "SELECT wr.item_id, wr.quantity, wr.approved_quantity, (SELECT name FROM inventory WHERE id = wr.item_id) AS item, (SELECT uom FROM inventory WHERE id = wr.item_id) AS uom, (SELECT category_name FROM inventory WHERE id = wr.item_id) AS category FROM warehouse_request wr WHERE wr.transaction_id = ?";
                            DBAccess.execute(query, [tid]).then(function(res) {
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
                            $scope.id = $scope.user.id;
                            $scope.tid = $scope.warehouseTransaction.id;
                            var query = "SELECT count(*) AS count FROM warehouse_response WHERE transaction_id = ?";
                            var param = [$scope.tid];
                            DBAccess.execute(query, param).then(function(res) {
                                if (res[0].count == 0) {
                                    console.log(0);
                                    /*
                                        Insert Warehouse Transaction and response
                                    */
                                    var insertWarehouseDelivery = "INSERT INTO warehouse_transaction (type, transaction_number, created_by, status, created, is_synced) VALUES (?,?,?,?,?,?)";
                                    var param = ['commissary_delivery', $scope.delivery_no, $scope.id, 1, dateFormatter.utc(new Date()), 0];
                                    DBAccess.execute(insertWarehouseDelivery, param).then(function(res) {
                                        if (res.insertId) {
                                            /*
                                                crid: commissary request id
                                                tid: transaction id
                                            */
                                            var crId = res.insertId;
                                            var tid = $scope.warehouseTransaction.id;
                                            angular.forEach($scope.order_delivery_item, function(value) {
                                                var insertWarehouseResponse = "INSERT INTO warehouse_response (warehouse_request_id, quantity, transaction_id) VALUES (?,?,?)";
                                                var param = [crId, parseInt(value.delivered), tid];
                                                DBAccess.execute(insertWarehouseResponse, param);
                                            });
                                        }
                                    }, function(err) {
                                        Log.write(err);
                                    });
                                } else {
                                    console.log(1);
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