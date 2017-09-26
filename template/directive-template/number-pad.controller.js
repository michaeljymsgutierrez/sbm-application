'use strict';

/* Number Pad Controller */

app.controller('numberPadCtrl', ['$scope', '$rootScope', 'Modal', 'DBAccess', 'Log', 'Toast', 'Reasons', function($scope, $rootScope, Modal, DBAccess, Log, Toast, Reasons) {
    /*
        Initialize output as numpad numeric output
    */
    $scope.output = "";

    /* Function for updating scope output */
    $scope.updateOutput = function(key) {
        $scope.output = $scope.output.concat(key);
    };

    /*
        Make sure that rootScope numpad_sender checked
        Condition if broacasted data is from inventory waste
        To set quantity for edit
    */
    if ($rootScope.numpad_sender == "inventory-waste") {
        if ($rootScope.item.qty) {
            $scope.output = $rootScope.item.qty.toString();
        }
    }

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
            /*
                Make sure that rootScope numpad_sender checked
                Condition if broacasted data is from inventory waste
            */
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
                        Modal.hide();
                        $rootScope.reason_sender = "inventory-waste";
                        Reasons.show();
                    }
                }, function(err) {
                    Log.write(err);
                });
            }
        }
    };

}]);