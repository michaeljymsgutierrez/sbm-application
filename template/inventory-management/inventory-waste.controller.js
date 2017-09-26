'use strict';

/* Inventory Waste Controller */

app.controller('inventoryWasteCtrl', ['$scope', 'DBAccess', 'Username', '$rootScope', function($scope, DBAccess, Username, $rootScope) {

    Username.popup();
    var unregisterUser = $rootScope.$on('user', function(event, data) {
        unregisterUser();
        $scope.user = data;
    });

}]);