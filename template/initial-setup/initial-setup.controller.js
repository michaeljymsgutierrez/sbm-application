'use strict';

/* Initialize electron API */
var remote = require('electron').remote;

/* Initial Setup controller */

app.controller('setupCtrl', ['$scope', 'validateApi', 'storage', '$state', 'backdrop', '$timeout', 'Toast', function($scope, validateApi, storage, $state, backdrop, $timeout, Toast) {

    /* API initialization */
    $scope.api = "";
    $scope.key = "";
    /* Form 1 API URL */
    $scope.form1 = true;
    /* Form 2 API KEY */
    $scope.form2 = false;
    /* Form 3 STORE */
    $scope.form3 = false;
    /* Store List and selected store */
    $scope.storelist = [];
    $scope.selectedStore;


    /* Function for validating api url */
    $scope.validateURL = function() {
        backdrop.show();
        $scope.checkAPI = validateApi.connect($scope.api);
        $scope.checkAPI.get(function(res) {
            backdrop.hide();
            if (res.data == 'Services Endpoint "bms" has been setup successfully.') {
                storage.write('endpoint', $scope.api);
                $scope.form1 = false;
                $scope.form2 = true;
            } else {
                Toast.show('Invalid API URL');
            }
        }, function(err) {
            backdrop.hide();
            Toast.show('Invalid API URL');
            $scope.form1 = true;
        });
    };

    /* Function for validatin api key */
    $scope.validateKey = function() {
        backdrop.show();
        $scope.api = storage.read('endpoint') + "/store/branch";
        $scope.checkAPI = validateApi.key($scope.api, $scope.key);
        $scope.checkAPI.get(function(res) {
            backdrop.hide();
            storage.write('apiKey', $scope.key);
            $scope.storelist = res.data;
            $scope.form2 = false;
            $scope.form3 = true;
        }, function(err) {
            backdrop.hide();
            Toast.show('Invalid API KEY')
        });
    };


    /* Function for saving store */
    $scope.saveStore = function() {
        backdrop.show();
        if ($scope.selectedStore == "" || $scope.selectedStore == undefined) {
            backdrop.hide();
            Toast.show('Please select store');
        } else {
            var pop = confirm('BMS is going to reinitialize . . .');
            if (pop == true) {
                storage.write('store_id', $scope.selectedStore);
                storage.write('reload', 'true');
                remote.getCurrentWindow().minimize();
                backdrop.hide();
                $state.go('dashboard');
            } else {
                backdrop.hide();
            }
        }
    }
}]);