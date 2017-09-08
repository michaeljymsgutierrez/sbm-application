'use strict';

/* Dashboard Controller */

app.controller('dashboardCtrl', ['DBAccess', '$scope', function(DBAccess, $scope) {

    /* 
        Get store name for dashboard 
        In case of error Dashboard will automatically set as storename
    */
    $scope.store_name = 'Dashboard';
    var storeInfo = "SELECT store_name FROM store_info";
    DBAccess.execute(storeInfo, []).then(function(res) {
        if (res.length == 0) {
            $scope.store_name = 'Dashboard';
        } else {
            $scope.store_name = res[0].store_name;
        }
    });
}]);