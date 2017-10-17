'use strict';

/*
    Warehouse Delivery Controller
*/

app.controller('warehouseDeliveryCtrl', ['$scope', function($scope) {
    /*
        Initialize scopes
    */
    $scope.order_no = "";
    $scope.delivery_no = "";

    /*
        Function for search transaction number
    */
    $scope.searchTransaction = function() {
        console.log($scope.order_no);
    };
}]);