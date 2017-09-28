'use strict';

/* Warehouse order Controller */

app.controller('warehouseOrderCtrl', ['$scope', 'Username', '$rootScope', 'DBAccess', function($scope, Username, $rootScope, DBAccess) {
    Username.popup();

    var initWarehouse = function() {
        $scope.warehouse_display = [];
        $scope.category = ['All'];
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

    var unregisterUser = $rootScope.$on('user', function(event, data) {
        unregisterUser();
        $scope.user = data;
        initWarehouse();
    });
}]);