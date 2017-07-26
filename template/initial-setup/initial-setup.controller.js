'use strict';

/* Initial Setup controller */

app.controller('setupCtrl', function($scope, validateApi, $q, storage, $resource) {

    /* API initialization */
    $scope.api = "";
    $scope.key = "";

    /* Alert visibility */
    $scope.showAlert = false;
    $scope.showAlert2 = false;

    /* Form 1 API URL */
    $scope.form1 = true;
    /* Form 2 API KEY */
    $scope.form2 = false;

    /* Fn for validating api url */
    $scope.validateURL = function() {
        $scope.checkAPI = validateApi.connect($scope.api);
        $scope.checkAPI.get(function(data) {
            storage.write('endpoint', $scope.api);
            $scope.showAlert = false;
            $scope.form1 = false;
            $scope.form2 = true;
        }, function(err) {
            $scope.showAlert = true;
            $scope.form1 = true;
        });
    };

    /* Fn for validatin api key */
    $scope.validateKey = function() {
        $scope.api = storage.read('endpoint') + "/store/branch";
        $scope.checkAPI = validateApi.key($scope.api, $scope.key);
        $scope.checkAPI.get(function(data) {
            $scope.showAlert2 = false;
            $scope.form1 = false;
        }, function(err) {
            $scope.showAlert2 = true;
        });
    };
});