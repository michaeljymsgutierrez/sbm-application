/* 
    Warehouse Item Modal Records Controller

*/

app.controller('warehouseItemCtrl', ['$scope', '$rootScope', 'Modal', function($scope, $rootScope, Modal) {
    $scope.data = $rootScope.warehouse_item_record;
    /*
        Function for close transaction summary
    */
    $scope.hideApprovedQty = $scope.data.type == 'commissary_delivery' ? 1 : 0;
    $scope.closeSummary = function() {
        Modal.hide();
    };

}]);