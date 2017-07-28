'use strict';

/* Sync Controller */

app.controller('syncCtrl', function($scope, storage, Store, DBAccess) {
    /* Get store id */
    var store_id = storage.read('store_id').store_id;

    /* Sync Store  */
    $scope.syncStore = function() {

        Store.get({ id: store_id }, function(res) {
            var response = res;
            DBAccess.execute('SELECT COUNT(*) as count FROM store_info').then(function(res) {
                if (res[0].count == 0) {
                    var insert = "INSERT INTO store_info (store_id, store_code, store_name, company, location) VALUES (?,?,?,?,?)";
                    var param = [response.store_id, response.store_code, response.store_name, response.company, response.location];
                    DBAccess.execute(insert, param);
                } else {
                    var update = "UPDATE store_info SET store_code = ?, store_name = ?, company = ?, location = ? WHERE store_id = ?";
                    var param = [response.store_code, response.store_name, response.company, response.location, parseInt(store_id)];
                    DBAccess.execute(update, param);
                }
            }, function(err) {
                console.log(err);
            });
        }, function(err) {
            console.log(err);
        });
    }


});