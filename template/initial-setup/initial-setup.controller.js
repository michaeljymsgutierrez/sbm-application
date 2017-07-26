'use strict';

/* Initialize electron API */
var remote = require('electron').remote;

/* Initial Setup controller */

app.controller('setupCtrl', function($scope, validateApi, storage, $state, backdrop, $timeout) {

    /* API initialization */
    $scope.api = "";
    $scope.key = "";
    /* Alert visibility */
    $scope.showAlert = false;
    /* Form 1 API URL */
    $scope.form1 = true;
    /* Form 2 API KEY */
    $scope.form2 = false;
    /* Form 3 STORE */
    $scope.form3 = false;
    /* Store List and selected store */
    $scope.storelist = [];
    $scope.selectedStore;


    /* Fn for validating api url */
    $scope.validateURL = function() {
        backdrop.show();
        $scope.checkAPI = validateApi.connect($scope.api);
        $scope.checkAPI.get(function(res) {
            backdrop.hide();
            storage.write('endpoint', $scope.api);
            $scope.showAlert = false;
            $scope.form1 = false;
            $scope.form2 = true;
        }, function(err) {
            backdrop.hide();
            $scope.showAlert = true;
            $scope.form1 = true;
        });
    };

    /* Fn for validatin api key */
    $scope.validateKey = function() {
        backdrop.show();
        $scope.api = storage.read('endpoint') + "/store/branch";
        $scope.checkAPI = validateApi.key($scope.api, $scope.key);
        $scope.checkAPI.get(function(res) {
            backdrop.hide();
            storage.write('apiKey', $scope.key);
            $scope.storelist = res.data;
            $scope.showAlert = false;
            $scope.form2 = false;
            $scope.form3 = true;
        }, function(err) {
            backdrop.hide();
            $scope.showAlert = true;
        });
    };


    /* Fn for saving store */
    $scope.saveStore = function() {
        backdrop.show();
        if ($scope.selectedStore == "" || $scope.selectedStore == undefined) {
            backdrop.hide();
            $scope.showAlert = true;
        } else {
            var pop = confirm('BMS is going to reinitialize . . .');
            if (pop == true) {
                $scope.showAlert = false;
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
});