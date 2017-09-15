'use strict';

/* Schedule Controller */

app.controller('scheduleCtrl', ['Username', '$rootScope', '$scope', 'DBAccess', 'Log', '$filter', function(Username, $rootScope, $scope, DBAccess, Log, $filter) {

    Username.popup();

    /* Listen for broadcasted user information */
    $rootScope.$on('user', function(event, data) {
        $scope.name = data.name;
        var eid = data.employee_id;
        var query = 'SELECT es.employee_id, es.date, es.shift, (SELECT store_name FROM branch_info WHERE _id = es.branch_id ) AS branch FROM employee_schedule es WHERE es.employee_id = ? ORDER BY es.date ASC';
        DBAccess.execute(query, [eid]).then(function(res) {
            angular.forEach(res, function(value) {
                var start = $filter('date')(new Date(value.shift.split('|')[0]), 'h:mm a');
                var end = $filter('date')(new Date(value.shift.split('|')[1]), 'h:mm a');
                value.shift = start + " - " + end;
            });
            $scope.schedule = res;
        }, function(err) {
            Log.write(err);
        });
    });
}]);