'use strict';

/* Dashboard Controller */

app.controller('dashboardCtrl', function(DBAccess, $scope) {

    /* Get store name for dashboard */
    var storeInfo = "SELECT store_name FROM store_info";
    DBAccess.execute(storeInfo, []).then(function(res) {
        $scope.store_name = res[0].store_name;
    });

});