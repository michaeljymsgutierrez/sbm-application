'use strict';

/* Inventory Waste Controller */

app.controller('inventoryWasteCtrl', ['$scope', 'DBAccess', 'Username', '$rootScope', 'Log', function($scope, DBAccess, Username, $rootScope, Log) {

    Username.popup();
    var unregisterUser = $rootScope.$on('user', function(event, data) {
        unregisterUser();
        $scope.user = data;
        $scope.inventory_display = [];
        $scope.category = ['All'];

        var query = "SELECT id, _id, name, uom, category_name FROM inventory WHERE status = 1";
        DBAccess.execute(query, []).then(function(res) {
            /* Contain inventory item */
            $scope.inventory_display = res;
            angular.forEach($scope.inventory_display, function(value) {
                $scope.category.push(value.category_name);
            });

        }, function(err) {
            Log.write(err);
        });
    });

}]);