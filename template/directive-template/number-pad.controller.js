'use strict';

/* Number Pad Controller */

app.controller('numberPadCtrl', ['$scope', '$rootScope', 'Modal', 'DBAccess', 'Log', 'Toast', 'Reasons', 'dateFormatter', function($scope, $rootScope, Modal, DBAccess, Log, Toast, Reasons, dateFormatter) {
    /*
        Initialize output as numpad numeric output
    */
    $scope.output = "";

    /* Function for updating scope output */
    $scope.updateOutput = function(key) {
        $scope.output = $scope.output.concat(key);
    };

    /*
        Make sure that rootScope numpad_sender checked
        Condition if broacasted data is from inventory waste
        To set quantity for edit
    */
    if ($rootScope.numpad_sender == "inventory-waste") {
        if ($rootScope.item.qty) {
            $scope.output = $rootScope.item.qty.toString();
        }
    } else if ($rootScope.numpad_sender == "warehouse-order") {
        if ($rootScope.item.qty) {
            $scope.output = $rootScope.item.qty.toString();
        }
    }

    /* Functions for numpad actions */
    $scope.delete = function() {
        $scope.output = $scope.output.slice(0, -1);
    };
    $scope.clear = function() {
        $scope.output = "";
    };
    $scope.cancel = function() {
        Modal.hide();
    };
    $scope.ok = function() {
        if ($scope.output != "") {
            /*
                Make sure that rootScope numpad_sender checked
                Condition if broacasted data is from inventory waste
            */
            if ($rootScope.numpad_sender == "inventory-waste") {
                var id = $rootScope.item.id;
                var dateNow = dateFormatter.standardNoTime(new Date);
                var query = "SELECT ib.qty , IFNULL((SELECT SUM(qty) FROM inventory_waste WHERE inventory_id = ? AND DATE_FORMAT(created,'%Y-%m-%d') = ? ),0) AS waste_qty FROM inventory_beginning ib WHERE ib.created = (SELECT max(created) FROM inventory_beginning) AND ib.inventory_id = ?";
                DBAccess.execute(query, [id, dateNow, id]).then(function(res) {
                        if (parseInt($scope.output) > (parseInt(res[0].qty) - parseInt(res[0].waste_qty))) {
                            Toast.show("Requested quantity is greater than item stack quantity");
                        } else if ($scope.output == 0) {
                            Toast.show("Requested quantity must be greater than 0");
                        } else {
                            $rootScope.$broadcast('numpad:inventory-waste', $scope.output);
                            Modal.hide();
                            $rootScope.reason_sender = "inventory-waste";
                            Reasons.show();
                        }
                    },
                    function(err) {
                        Log.write(err);
                    });
            } else if ($rootScope.numpad_sender == "warehouse-pulloutrequest") {
                /*
                var id = $rootScope.item.id;
                var dateNow = dateFormatter.standardNoTime(new Date);
                var query = "SELECT ib.qty , IFNULL((SELECT SUM(qty) FROM inventory_waste WHERE inventory_id = ? AND DATE_FORMAT(created,'%Y-%m-%d') = ? ),0) AS waste_qty FROM inventory_beginning ib WHERE ib.created = (SELECT max(created) FROM inventory_beginning) AND ib.inventory_id = ?";
                DBAccess.execute(query, [id, dateNow, id]).then(function(res) {
                    console.log(res);
                }, function(err) {
                    Log.write(err);
                });
                */

                var dateNow = dateFormatter.standardNoTime(new Date);
                var query = "SELECT * FROM warehouse_transaction WHERE DATE_FORMAT(created,'%Y-%m-%d') = ? AND type = ?";
                DBAccess.execute(query, [dateNow, 'commissary_delivery']).then(function(res) {
                    $scope.delivery = res;
                    angular.forEach($scope.delivery, function(value) {
                        var query = "SELECT warehouse_request_id AS wrid FROM warehouse_response WHERE transaction_id = ?";
                        DBAccess.execute(query, [value.id]).then(function(res) {
                            value.items = res;
                            angular.forEach(value.items, function(itemValue) {
                                var query = "SELECT wr.approved_quantity , wr.item_id, (SELECT i._id FROM inventory i WHERE i.id = wr.item_id) AS _id FROM warehouse_request wr WHERE wr.id = ?";
                                DBAccess.execute(query, [itemValue.wrid]).then(function(res) {
                                    itemValue._id = res[0]._id;
                                    itemValue.item_id = res[0].item_id;
                                    itemValue.approved_quantity = res[0].approved_quantity;
                                }, function(err) {
                                    console.log(err);
                                });
                            });
                        }, function(err) {
                            Log.write(err);
                        });
                    });
                    console.log($scope.delivery);
                }, function(err) {
                    Log.write(err);
                });
            } else if ($rootScope.numpad_sender == "warehouse-order") {
                $rootScope.$broadcast('numpad:warehouse-order', $scope.output);
                Modal.hide();
            }
        }
    };
}]);