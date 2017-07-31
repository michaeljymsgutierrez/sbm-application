'use strict';

/* Sync Controller */

app.controller('syncCtrl', function($q, $scope, storage, backdrop, Store, Branch, Reason, DBAccess, Log) {
    /* Get store id */
    var store_id = storage.read('store_id').store_id;

    /* Sync Store  */
    $scope.syncStore = function() {
        backdrop.show();
        /* Get store info */
        Store.get({ id: store_id }, function(res) {
            var response = res;
            DBAccess.execute('SELECT COUNT(*) as count FROM store_info', []).then(function(res) {
                if (res[0].count == 0) {
                    var insert = "INSERT INTO store_info (store_id, store_code, store_name, company, location, bank) VALUES (?,?,?,?,?,?)";
                    var param = [response.store_id, response.store_code, response.store_name, response.company, response.location, response.bank.join()];
                    DBAccess.execute(insert, param);
                } else {
                    var update = "UPDATE store_info SET store_code = ?, store_name = ?, company = ?, location = ? , bank = ? WHERE store_id = ?";
                    var param = [response.store_code, response.store_name, response.company, response.location, response.bank.join(), parseInt(store_id)];
                    DBAccess.execute(update, param);
                }
            }, function(err) {
                Log.write(err);
            });
        }, function(err) {
            Log.write(err);
        });

        /* Get branch info */
        Branch.get({ id: store_id }, function(res) {
            var response = res;
            if (response.length != 0) {
                angular.forEach(response, function(value) {
                    var update = "UPDATE branch_info SET store_name = ? WHERE _id = ?";
                    DBAccess.execute(update, [value.store_name, value.store_id]).then(function(res) {
                        if (res.affectedRows == 0) {
                            var insert = "INSERT INTO branch_info (_id, store_name) VALUES (?,?)";
                            DBAccess.execute(insert, [value.store_id, value.store_name]);
                        }
                    }, function(err) {
                        Log.write(err);
                    });
                });
            }
        }, function(err) {
            Log.write(err);
        });

        /* Get reason data */
        Reason.get({ id: store_id }, function(res) {
            var response = res;
            angular.forEach(response, function(value) {
                var update = "UPDATE reason SET reason = ? WHERE _id = ? AND  module = ?";
                DBAccess.execute(update, [response.text, response.id, response.module]).then(function(res) {
                    if (res.affectedRows == 0) {
                        var insert = "INSERT INTO reason (_id, module, reason) VALUES (?,?,?)";
                        DBAccess.execute(insert, [value.id, value.module, value.text]);
                    }
                })
            }, function(err) {
                Log.write(err);
            });
        }, function(err) {
            Log.write(err);
        });
    };


});