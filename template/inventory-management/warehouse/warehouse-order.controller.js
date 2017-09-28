'use strict';

/* Warehouse order Controller */

app.controller('warehouseOrderCtrl', ['$scope', 'Username', '$rootScope', function($scope, Username, $rootScope) {
    Username.popup();

    var unregisterUser = $rootScope.$on('user', function(event, data) {
        unregisterUser();
        $scope.user = data;
    });
}]);