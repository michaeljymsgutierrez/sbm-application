'use strict';


/* Settings Controller */

app.controller('settingsCtrl', ['$scope', 'storage', 'Toast', function($scope, storage, Toast) {

    /* Initialize variables */
    $scope.settings = {};

    /* Fn for save settings */
    $scope.saveSettings = function() {
        Toast.show('Settings successfully save . . .');
        storage.write('settings', $scope.settings);
    };
}]);