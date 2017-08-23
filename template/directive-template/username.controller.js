'use strict';

/* Username Controller */

app.controller('usernameCtrl', function($rootScope, $scope, Toast, Modal, $state, $timeout, DBAccess, Log) {

    /* Function for redirecting to dashbard */
    function gotoDashboard() {
        Modal.hide();
        Toast.show('Employee not found');
        $timeout(function() {
            $state.go('dashboard');
        }, 1000);
    }

    /* Validation for username and Event Listener Across DOM */
    $timeout(function() {
        jQuery('.user-prompt .cancel').click(function() {
            gotoDashboard();
        });

        jQuery('.user-prompt .submit').click(function() {
            $scope.username = jQuery('.username-input').val();
            if ($scope.username == undefined | $scope.username == '') {
                gotoDashboard();
            } else {
                var query = 'SELECT * FROM employee WHERE username = ? AND active = 1';
                DBAccess.execute(query, [$scope.username]).then(function(res) {
                    if (res.length > 0) {
                        Modal.hide();
                        $rootScope.$broadcast('user', res[0]);
                    } else {
                        gotoDashboard();
                    }
                }, function(err) {
                    Log.write(err);
                });
            }
        });
    }, 500);

});