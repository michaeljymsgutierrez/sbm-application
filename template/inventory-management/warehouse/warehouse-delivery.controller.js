'use strict';

/*
    Warehouse Delivery Controller
*/

app.controller('warehouseDeliveryCtrl', ['$scope', 'DBAccess', 'Username', function($scope, DBAccess, Username) {

    Username.popup();
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