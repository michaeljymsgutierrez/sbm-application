'use strict';

/* Initial Setup controller */

app.controller('setupCtrl', function($scope, validateApi, $q, storage) {

    /* API initialization */
    $scope.api = "";
    $scope.data = "";

    $scope.validateURL = function() {
        var deferred = $q.defer();
        $scope.checkAPI = validateApi.connect($scope.api);
        $scope.checkAPI.get(function(data) {
            deferred.resolve(data);
            return deferred.promise;
        }, function(err) {
            deferred.reject(data);
            return deferred.promise;
        });
    };
});