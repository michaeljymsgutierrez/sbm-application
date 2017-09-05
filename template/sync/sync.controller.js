'use strict';

/* Sync Controller */

app.controller('syncCtrl', ['$q', '$scope', 'storage', 'backdrop', 'dateFormatter', 'Store', 'Branch', 'Reason', 'DBAccess', 'Log', 'Toast', 'Employee', function($q, $scope, storage, backdrop, dateFormatter, Store, Branch, Reason, DBAccess, Log, Toast, Employee) {
    /* Get store id */
    var store_id = storage.read('store_id').store_id;

    /* Sync Store  */
    $scope.syncStore = function() {

        /* Intialize timeout for showing backdrop and sync based on xhr success 
           $scope.timeout = N of xhr
           $scope.timeout = -1 if error on xhr
           Set $scope.timeout to 0 of and increment as xhr success
           Change val to N of xhr
        */
        $scope.timeout = 0;
        backdrop.show();
        $scope.$watch('timeout', function(val) {
            if (val == 3) {
                backdrop.hide();
                Toast.show("Syncing store data successful");
            } else if (val == -1) {
                backdrop.hide();
                Toast.show("Unable to connect to server");
            }
        });

        /* Get store info */
        Store.get({ id: store_id }, function(res) {
            var response = res;
            $scope.timeout++;
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
            $scope.timeout = -1;
            Log.write(err);
        });

        /* Get branch info */
        Branch.get({ id: store_id }, function(res) {
            var response = res;
            $scope.timeout++;
            if (response.length != 0) {
                angular.forEach(response, function(value) {
                    DBAccess.execute('SELECT * FROM branch_info WHERE _id = ?', [value.store_id]).then(function(res) {
                        if (res.length == 0) {
                            var insert = "INSERT INTO branch_info (_id, store_name) VALUES (?,?)";
                            DBAccess.execute(insert, [value.store_id, value.store_name]);
                        } else {
                            var update = "UPDATE branch_info SET store_name = ? WHERE _id = ?";
                            DBAccess.execute(update, [value.store_name, value.store_id]);
                        }
                    }, function(err) {
                        Log.write(err);
                    });
                });
            }
        }, function(err) {
            $scope.timeout = -1;
            Log.write(err);
        });

        /* Get reason data */
        Reason.get({ id: store_id }, function(res) {
            var response = res;
            $scope.timeout++;
            if (response.length != 0) {
                angular.forEach(response, function(value) {
                    DBAccess.execute('SELECT * FROM reason WHERE _id = ?', [value.id]).then(function(res) {
                        if (res.length == 0) {
                            var insert = "INSERT INTO reason (_id, module, reason) VALUES (?,?,?)";
                            DBAccess.execute(insert, [value.id, value.module, value.text]);
                        } else {
                            var update = "UPDATE reason SET  module = ?, reason = ? WHERE _id = ?";
                            DBAccess.execute(update, [value.module, value.text, value.id]);
                        }
                    }, function(err) {
                        Log.write(err);
                    });
                });
            }
        }, function(err) {
            $scope.timeout = -1;
            Log.write(err);
        });
    };


    /* Sync Employee */
    $scope.syncEmployee = function() {

        $scope.timeout = 0;
        backdrop.show();
        $scope.$watch('timeout', function(val) {
            if (val == 2) {
                backdrop.hide();
                Toast.show("Employee sync successful");
            } else if (val == -1) {
                backdrop.hide();
                Toast.show("Unable to connect to server");
            }
        });

        /* Get all Employee data */
        Employee.get({ id: store_id, path: 'employee' }, function(res) {
            var response = res;
            $scope.timeout++;
            angular.forEach(response, function(value) {
                DBAccess.execute("SELECT * FROM employee WHERE user_id = ?", [value.uid]).then(function(res) {
                    if (res.length == 0) {
                        var insert = "INSERT INTO employee (employee_id, user_id, name, username, role, active, created) VALUES (?,?,?,?,?,?,?)";
                        var param = [value.employee_id, value.uid, value.name, value.username, value.role, value.active, dateFormatter.utc(new Date())];
                        DBAccess.execute(insert, param);
                    } else {
                        var update = "UPDATE employee SET employee_id = ?, name = ?, username = ?, role =?, active = ?, created = ? WHERE user_id = ?";
                        var param = [value.employee_id, value.name, value.username, value.role, value.active, dateFormatter.utc(new Date()), value.uid];
                        DBAccess.execute(update, param);
                    }
                }, function(err) {
                    Log.write(err);
                });
            });
        }, function(err) {
            $scope.timeout = -1;
            Log.write(err);
        });

        /* Get all Employee data schdeul */
        Employee.get({ id: store_id, path: "employee", path2: 'schedule' }, function(res) {
            var response = res;
            $scope.timeout++;
            angular.forEach(response, function(value) {
                var eid = value.employee_id;
                var schedule = value.schedule;
                angular.forEach(schedule, function(schedule_value) {
                    var sid = schedule_value.schedule_id;
                    DBAccess.execute("SELECT * FROM employee_schedule WHERE _id = ?", [sid]).then(function(res) {
                        if (res.length == 0) {
                            var query = "INSERT INTO employee_schedule (_id, employee_id, date, shift, start, end, branch_id) VALUES (?,?,?,?,?,?,?)";
                            var param = [sid, eid, dateFormatter.standard(new Date(schedule_value.date)), schedule_value.shift, dateFormatter.standard(new Date(schedule_value.shift.split("|")[0])), dateFormatter.standard(new Date(schedule_value.shift.split("|")[1])), schedule_value.store_assignment];
                            DBAccess.execute(query, param);
                        } else {
                            var query = "UPDATE employee_schedule SET employee_id = ?, date =?, shift = ?, start = ?, end = ?, branch_id = ? WHERE _id = ?";
                            var param = [eid, dateFormatter.standard(new Date(schedule_value.date)), schedule_value.shift, dateFormatter.standard(new Date(schedule_value.shift.split("|")[0])), dateFormatter.standard(new Date(schedule_value.shift.split("|")[1])), schedule_value.store_assignment, sid];
                            DBAccess.execute(query, param);
                        }
                    }, function(err) {
                        Log.write(err);
                    });
                });
            });
        }, function(err) {
            $scope.timeout = -1;
            Log.write(err);
        });
    };

}]);