'use strict';

/*
    Warehouse Delivery Controller
*/

app.controller('warehouseDeliveryCtrl', ['$scope', 'DBAccess', 'Username', '$rootScope', function($scope, DBAccess, Username, $rootScope) {

    Username.popup();
    /*
        Initialize scopes
    */
    $scope.order_no = "";
    $scope.delivery_no = "";
    var unregisterUser = $rootScope.$on('user', function(event, data) {
        unregisterUser();
        $scope.user = data;

        /*
            Function for search transaction number
        */
        $scope.searchTransaction = function() {
            console.log($scope.order_no);
        };

    });
}]);