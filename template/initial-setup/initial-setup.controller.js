'use strict';

/* Initial Setup controller */

app.controller('setupCtrl', function($scope, validateApi, $q, storage) {

    /* API initialization */
    $scope.api = "";
    /* Alert visibility */
    $scope.showAlert = false;

    $scope.validateURL = function() {
        var deferred = $q.defer();
        $scope.checkAPI = validateApi.connect($scope.api);
        $scope.checkAPI.get(function(data) {
            $scope.showAlert = false;
            deferred.resolve(data);
            return deferred.promise;
        }, function(err) {
            $scope.showAlert = true;
            deferred.reject(data);
            return deferred.promise;
        });
    };
});