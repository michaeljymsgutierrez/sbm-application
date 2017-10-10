'use strict';

/*
    Transction Filter controller
*/

app.controller('transactionFilterCtrl', ['$scope', '$rootScope', 'Toast', 'Modal', function($scope, $rootScope, Toast, Modal) {

    /*
        Function for broadcasting Transaction Type
    */
    $scope.select = function() {
        if ($scope.transaction_type == undefined) {
            $scope.transaction_type = 'all';
        }
        $rootScope.$broadcast('filter:transaction-type', $scope.transaction_type);
        Modal.hide();
    };

    /*
        Function for cancel transaction type modal
    */
    $scope.cancel = function() {
        Modal.hide();
    };
}]);