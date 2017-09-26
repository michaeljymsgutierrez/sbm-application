'use strict';

/* Reason Controller */

app.controller('reasonCtrl', ['$scope', 'DBAccess', '$rootScope', 'Log', 'Modal', 'Toast', function($scope, DBAccess, $rootScope, Log, Modal, Toast) {

    /*
        Reason to be displayed must be checked whos sender
        check sender by logging rootScope reason_sender to display corresponding reason module
    */
    $scope.reason = [];
    $scope.selected_reason = "";
    if ($rootScope.reason_sender == "inventory-waste") {
        var query = "SELECT reason FROM reason WHERE module = 'inventory_wastage'";
        DBAccess.execute(query, []).then(function(res) {
            if (res.length != 0) {
                angular.forEach(res, function(value) {
                    $scope.reason.push(value.reason);
                });
            }
        }, function(err) {
            Log.write(err);
        });
    }

    /*
        Reason button functions
    */
    $scope.cancel = function() {
        Modal.hide();
    };
    $scope.select = function() {
        if ($scope.selected_reason != "") {
            if ($rootScope.reason_sender == "inventory-waste") {
                $rootScope.$broadcast('reason:inventory-waste', $scope.selected_reason);
                Modal.hide();
            }
        } else {
            Toast.show("Reason is required");
        }
    };

}]);