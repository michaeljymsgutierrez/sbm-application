'use strict';

/* Warehouse records controller */

app.controller('warehouseRecordsCtrl', ['$scope', 'Username', function($scope, Username) {
    Username.popup();
    $scope.data = "SAMPLE DATA";
}]);