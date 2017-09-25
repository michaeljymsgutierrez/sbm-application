'use strict';

/* Number Pad Controller */

app.controller('numberPadCtrl', ['$scope', '$rootScope', 'Modal', 'DBAccess', 'Log', 'Toast', function($scope, $rootScope, Modal, DBAccess, Log, Toast) {
    /*
        Initialize output as numpad numeric output
    */
    $scope.output = "";

    /* Function for updating scope output */
    $scope.updateOutput = function(key) {
        $scope.output = $scope.output.concat(key);
    };

    /* Functions for numpad actions */
    $scope.delete = function() {
        $scope.output = $scope.output.slice(0, -1);
    };
    $scope.clear = function() {
        $scope.output = "";
    };
    $scope.cancel = function() {
        Modal.hide();
    };
    $scope.ok = function() {
        if ($scope.output != "") {
            if ($rootScope.numpad_sender == "inventory-waste") {
                var id = $rootScope.item.id;
                var query = "SELECT qty FROM inventory_actual WHERE created = (SELECT max(created) FROM inventory_actual) AND inventory_id = ?";
                DBAccess.execute(query, [id]).then(function(res) {
                    if (parseInt($scope.output) > parseInt(res[0].qty)) {
                        Toast.show("Requested quantity is greater than item stack quantity");
                    } else if ($scope.output == 0) {
                        Toast.show("Requested quantity must be greater than 0");
                    } else {
                        $rootScope.$broadcast('numpad:inventory-waste', $scope.output);
                    }
                }, function(err) {
                    Log.write(err);
                });
            }
        }
    };

}]);