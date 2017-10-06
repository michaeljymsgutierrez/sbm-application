'use strict';

/* Warehouse order Controller */

app.controller('warehouseOrderCtrl', ['$scope', 'Username', '$rootScope', 'DBAccess', 'dateFormatter', 'storage', 'NumberPad', 'Log', 'Toast', function($scope, Username, $rootScope, DBAccess, dateFormatter, storage, NumberPad, Log, Toast) {
    Username.popup();

    /* 
        Initialize Warehouse Item 
    */
    var initWarehouse = function() {
        $scope.warehouse_display = [];
        $scope.category = ['All'];
        $scope.datenow = dateFormatter.slashFormat(new Date());
        $scope.employee_name = $scope.user.name;
        $scope.transaction_no = storage.read('store_code') + "-WO-" + dateFormatter.timestamp(new Date());
        var query = "SELECT id, _id, name, uom, category_name FROM inventory WHERE status = 1";
        DBAccess.execute(query, []).then(function(res) {
            /* Contain Warehouse Item */
            $scope.warehouse_item = res;
            $scope.warehouse_display = res;

            /* Load category */
            angular.forEach($scope.warehouse_item, function(value) {
                if ($scope.category.indexOf(value.category_name) == -1) {
                    $scope.category.push(value.category_name);
                }
            });
        }, function(err) {
            Log.write(err);
        });
    };

    /*
        Function for Filterin Warehous Item by category
    */
    $scope.filterByCategory = function(x) {
        $scope.warehouse_display = [];
        if (x == 'All') {
            $scope.warehouse_display = $scope.warehouse_item;
        } else {
            angular.forEach($scope.warehouse_item, function(value) {
                if (x == value.category_name) {
                    $scope.warehouse_display.push(value);
                }
            });
        }
    };

    var unregisterUser = $rootScope.$on('user', function(event, data) {
        unregisterUser();
        $scope.user = data;
        initWarehouse();
    });

    /*
        Add warehouse item
    */
    $scope.addItem = function(item) {
        NumberPad.show();
        $rootScope.numpad_sender = "warehouse-order";
        $rootScope.item = item;
        var unregisterNumpad = $rootScope.$on('numpad:warehouse-order', function(event, data) {
            unregisterNumpad();
            $rootScope.item.qty = parseInt(data);
        });
    }

    /*
        Save warehouse order
    */
    $scope.saveWarehouseOrder = function() {
        angular.forEach($scope.warehouse_item, function(value) {
            if (value.qty) {
                $scope.warehouse_order_status = 'save';
            }
        });

        if ($scope.warehouse_order_status == 'save') {
            var insertWarehouseOrder = "INSERT INTO warehouse_transaction (type,transaction_number, status, created_by, created, is_synced) VALUES (?,?,?,?,?,?)";
            var warehouseOrderParam = ['order_commissary', $scope.transaction_no, 0, $scope.user.id, dateFormatter.utc(new Date()), 0];
            DBAccess.execute(insertWarehouseOrder, warehouseOrderParam).then(function(res) {
                $scope.tid = res.insertId;
                angular.forEach($scope.warehouse_item, function(value) {
                    if (value.qty) {
                        var insertWareahouseRequet = "INSERT INTO warehouse_request (item_id, quantity, approved_quantity, reason, transaction_id) VALUES (?,?,?,?,?)";
                        var warehouseRequestParam = [value.id, value.qty, '', '', $scope.tid];
                        DBAccess.execute(insertWareahouseRequet, warehouseRequestParam);
                    }
                });
                initWarehouse();
                $scope.warehouse_order_status = 'nothing-to-save';
            }, function(err) {
                Log.write(err);
            });
        }
        Toast.show("Saving warehouse request transction successful");
    };

    /*
        Delete item function
    */
    $scope.deleteItem = function(id) {
        angular.forEach($scope.warehouse_item, function(value) {
            if (value.id == id) {
                delete value['qty'];
            }
        });
    };


}]);