'use strict';

/* Username Controller */

app.controller('usernameCtrl', function($scope, Toast, Modal, $state, $timeout, DBAccess, Log) {

    /* Validation for username and Event Listener Across DOM */
    $timeout(function() {
        jQuery('.user-prompt .cancel').click(function() {
            Modal.hide();
            Toast.show('Employee not found');
            $timeout(function() {
                $state.go('dashboard');
            }, 1000);
        });

        jQuery('.user-prompt .submit').click(function() {
            $scope.username = jQuery('.username-input').val();
            if ($scope.username == undefined | $scope.username == '') {
                Modal.hide();
                Toast.show('Employee not found');
                $timeout(function() {
                    $state.go('dashboard');
                }, 1000);
            } else {
                var query = 'SELECT * FROM employee WHERE username = ?';
                DBAccess.execute(query, [$scope.username]).then(function(res) {
                    console.log(res);
                }, function(err) {
                    Log.write(err);
                });
            }
        });
    }, 500);

});