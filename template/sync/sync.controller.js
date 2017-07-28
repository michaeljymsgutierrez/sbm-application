'use strict';

/* Sync Controller */

app.controller('syncCtrl', function($scope, storage, Store) {
    /* Get store id */
    var store_id = storage.read('store_id').store_id;

    /* Sync Store  */
    $scope.syncStore = function() {
        Store.get({ id: store_id }, function(res) {
            console.log(res);
        }, function(err) {
            console.log(err);
        });
    }


});