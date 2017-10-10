'use strict';

/*
    Transction Filter controller
*/

app.controller('transactionFilterCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {

    /*
        Function for broadcasting Transaction Type
    */
    $scope.selectedTransactionType = function() {
        $rootScope.$broadcast('filter:transaction-type', $scope.transactio_type);
    };
}]);