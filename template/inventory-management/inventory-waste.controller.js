'use strict';

/* Inventory Waste Controller */

app.controller('inventoryWasteCtrl', ['$scope', 'DBAccess', 'Username', '$rootScope', 'Log', 'dateFormatter', 'NumberPad', function($scope, DBAccess, Username, $rootScope, Log, dateFormatter, NumberPad) {

    Username.popup();
    /*
        Load all inventory wastage reasons
    */
    $scope.reason = [];
    var reasonQuery = "SELECT * FROM reason WHERE module = 'inventory_wastage'";
    DBAccess.execute(reasonQuery, []).then(function(res) {
        $scope.reason = res;
    }, function(err) {
        Log.write(err);
    });

    var unregisterUser = $rootScope.$on('user', function(event, data) {
        unregisterUser();
        $scope.user = data;
        $scope.inventory_display = [];
        $scope.category = ['All'];
        $scope.datenow = dateFormatter.slashFormat(new Date());

        var query = "SELECT id, _id, name, uom, category_name FROM inventory WHERE status = 1";
        DBAccess.execute(query, []).then(function(res) {
            /* Contain inventory item */
            $scope.inventory_item = res;
            $scope.inventory_display = res;
            /* Load category from database */
            angular.forEach($scope.inventory_display, function(value) {
                $scope.category.push(value.category_name);
            });
        }, function(err) {
            Log.write(err);
        });
    });

    /*
        Function for category filtering of item on click
    */
    $scope.filterByCategory = function(category) {
        $scope.inventory_display = [];
        if (category == 'All') {
            $scope.inventory_display = $scope.inventory_item;
        } else {
            angular.forEach($scope.inventory_item, function(value) {
                if (value.category_name == category) {
                    $scope.inventory_display.push(value);
                }
            });
        }
    };


    /*
        Function for adding item to wastage
    */
    $scope.addItem = function(item) {
        NumberPad.show();
        $rootScope.numpad_sender = "inventory-waste";
        $rootScope.item = item;
        var unregisterNumpad = $rootScope.$on('numpad:inventory-waste', function(event, data) {
            unregisterNumpad();
            $rootScope.item.qty = parseInt(data);
        });
    };

}]);