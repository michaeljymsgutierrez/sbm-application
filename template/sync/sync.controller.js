'use strict';

/* Sync Controller */

app.controller('syncCtrl', ['$q', '$scope', 'storage', 'backdrop', 'dateFormatter', 'Store', 'Branch', 'Reason', 'DBAccess', 'Log', 'Toast', 'Employee', 'SyncData', 'Inventory', 'SyncInventory', function($q, $scope, storage, backdrop, dateFormatter, Store, Branch, Reason, DBAccess, Log, Toast, Employee, SyncData, Inventory, SyncInventory) {
    /* Get store id */
    var store_id = storage.read('store_id').store_id;
    backdrop.auto(1000);

    /*
        loadUnsync : Reusable function for reloading unsync counts
    */
    $scope.loadUnsync = function() {

        /*
            Load unsync attendance count
            Function for sync attendance to server

        */
        $scope.attendanceToSync = [];
        $scope.attendanceCount = 0;
        var unsyncAttendance = "SELECT a.id, a.schedule_id, a.username, a.employee_id, a.is_completed FROM attendance a WHERE a.is_completed = 1 AND a.is_synced = 0";
        DBAccess.execute(unsyncAttendance, []).then(function(res) {
                $scope.attendanceToSync = res;
                $scope.attendanceCount = res.length;
                angular.forEach($scope.attendanceToSync, function(value) {
                    var id = value.id;
                    var attendanceAction = "SELECT * FROM attendance_time_log WHERE attendance_id = ?";
                    DBAccess.execute(attendanceAction, [id]).then(function(res) {
                        var user_actions = res;
                        value.actions = [];
                        angular.forEach(user_actions, function(a) {
                            var action_list = {
                                action: a.action,
                                created: dateFormatter.standard(a.created),
                                mugshot: {
                                    file: a.mugshot,
                                    filename: a.filename,
                                    filepath: "public://attendance/" + a.filename
                                }
                            };
                            value.actions.push(action_list);
                        });
                    }, function(err) {
                        Log.write(err);
                    });
                });

                /*
                    Sync attendance from mobile to backoffice
                */
                $scope.syncAttendanceFromDevice = function() {
                    backdrop.show();
                    angular.forEach($scope.attendanceToSync, function(data) {
                        SyncData.send({ param1: store_id, param2: 'attendance', data: data }, function(res) {
                            $scope.attendanceCount = $scope.attendanceCount - 1;
                            var sid = res.schedule_id;
                            var update = "UPDATE attendance SET is_synced = 1 WHERE schedule_id = ?";
                            DBAccess.execute(update, [sid]);
                        }, function(err) {
                            backdrop.hide();
                            Toast.show('Unable to connect to server');
                            Log.write(err);
                        });
                    });
                    $scope.$watch('attendanceCount', function(val) {
                        if (val == 0) {
                            backdrop.hide();
                            Toast.show('Attendance synced successful');
                        }
                    });
                };
            },
            function(err) {
                Log.write(err);
            });


        /*
            Load unysnc inventory count
            Function for sync inventory to server
            
        */
        $scope.inventoryToSync = [];
        $scope.inventoryActual = [];
        $scope.inventoryWaste = [];
        $scope.inventoryCount = 0;
        var unsyncActual = "SELECT ia.id, ia.created, ia.qty AS quantity, (SELECT user_id FROM employee WHERE id = ia.created_by) AS created_by_id, (SELECT username FROM employee WHERE id = ia.created_by) AS created_by_name, (SELECT _id FROM inventory WHERE id = ia.inventory_id) AS item_id, ('actual') AS transaction_type FROM inventory_actual ia WHERE is_synced = 0";
        DBAccess.execute(unsyncActual, []).then(function(res) {
            /* Initial Inventory Actual */
            $scope.inventoryActual = res;
            var unsyncWaste = "SELECT iw.id, iw.reason, iw.created, iw.qty AS quantity, (SELECT user_id FROM employee WHERE id = iw.created_by) AS created_by_id, (SELECT username FROM employee WHERE id = iw.created_by) AS created_by_name, (SELECT _id FROM inventory WHERE id = iw.inventory_id) AS item_id, ('waste') AS transaction_type FROM inventory_waste iw WHERE is_synced = 0";
            DBAccess.execute(unsyncWaste, []).then(function(res) {
                /* Initial Inventory Waste */
                $scope.inventoryWaste = res;
                $scope.inventoryCount = $scope.inventoryActual.length + $scope.inventoryWaste.length;

                $scope.syncInventoryFromDevice = function() {
                    backdrop.show();
                    $scope.inventoryToSync = $scope.inventoryWaste.concat($scope.inventoryActual);
                    angular.forEach($scope.inventoryToSync, function(data) {
                        data.created = dateFormatter.standard(data.created);
                        SyncInventory.send(store_id, data).then(function(res) {
                            $scope.inventoryCount = $scope.inventoryCount - 1;
                            if (res.transaction_type == 'actual') {
                                var updateActual = "UPDATE inventory_actual SET is_synced = 1 WHERE id = ?";
                                DBAccess.execute(updateActual, [res.id]);
                            } else if (res.transaction_type == 'waste') {
                                var updateWaste = "UPDATE inventory_waste SET is_synced = 1 WHERE id = ?";
                                DBAccess.execute(updateWaste, [res.id]);
                            }
                        }, function(err) {
                            backdrop.hide();
                            Toast.show('Unable to connect to server');
                            Log.write(err);
                        });
                    });
                    $scope.$watch('inventoryCount', function(val) {
                        if (val == 0) {
                            backdrop.hide();
                            Toast.show('Inventory synced successful');
                        }
                    });
                };

            }, function(err) {
                Log.write(err);
            });
        }, function(err) {
            Log.write(err);
        });

        /*
            Load unysnc warehouse count
            Function for sync warehouse to server
            
        */
        $scope.warehouseToSync = [];
        $scope.warehouseOrder = [];
        $scope.warehouseCount = 0;
        var unsyncWarehouse = "SELECT DATE_FORMAT(wt.created,'%Y-%m-%d %H:%i:%s') AS created, (SELECT username FROM employee WHERE id = wt.created_by) AS created_by_name, (SELECT user_id FROM employee WHERE id = wt.created_by) AS created_by_id ,(NULL) AS reason,(NULL) AS request_number, wt.id AS transaction_id, wt.transaction_number, wt.type AS transaction_type FROM warehouse_transaction wt WHERE is_synced = 0";
        DBAccess.execute(unsyncWarehouse, []).then(function(res) {
            $scope.warehouseCount = res.length;
            $scope.warehouseOrder = res;
            angular.forEach($scope.warehouseOrder, function(value) {
                var tid = value.transaction_id;
                var query = "SELECT (SELECT _id FROM inventory WHERE id = wr.item_id) AS item_id, (SELECT name FROM inventory WHERE id = wr.item_id) AS item_name, (SELECT uom FROM inventory WHERE id = wr.item_id) AS item_uom, quantity, (NULL) AS reason FROM warehouse_request wr WHERE wr.transaction_id = ?";
                DBAccess.execute(query, [tid]).then(function(res) {
                    value.items = res;
                }, function(err) {
                    Log.write(err);
                });

                $scope.syncWarehouseFromDevice = function() {
                    backdrop.show();
                    angular.forEach($scope.warehouseOrder, function(value) {
                        SyncData.send({ param1: store_id, param2: 'commissary', data: value }, function(res) {
                            var id = res.transaction_id;
                            $scope.warehouseCount--;
                            var updateWarehouseTransaction = "UPDATE warehouse_transaction SET is_synced = 1 WHERE id = ?";
                            DBAccess.execute(updateWarehouseTransaction, [id]);
                        }, function(err) {
                            backdrop.hide();
                            Toast.show('Unable to connect to server');
                            Log.write(err);
                        });
                    });
                    $scope.$watch('warehouseCount', function(val) {
                        if (val == 0) {
                            backdrop.hide();
                            Toast.show('Warehouse synced successful');
                        }
                    });
                };
            });
        }, function(err) {
            Log.write(err);
        });
    };

    /* 
        Initialized Unsync Data from local 
        All initialization of unsync count on mobile and creation of functions 
        for syncing items are all on loadUnsync()
        Erorrs are also recorded on log.txt
    */
    $scope.loadUnsync();

    /* Intialize timeout for showing backdrop and sync based on xhr success 
           $scope.timeout = N of xhr
           $scope.timeout = -1 if error on xhr
           Set $scope.timeout to 0 of and increment as xhr success
           Change val to N of xhr
    */

    /* Sync Store  */
    $scope.syncStore = function() {

        $scope.timeout = 0;
        backdrop.show();
        $scope.$watch('timeout', function(val) {
            if (val == 3) {
                backdrop.hide();
                Toast.show("Store sync successful");
            } else if (val == -1) {
                backdrop.hide();
                Toast.show("Unable to connect to server");
            }
        });

        /* Get store info */
        Store.get({ id: store_id }, function(res) {
            var response = res;
            storage.write('store_code', response.store_code);
            $scope.timeout++;
            DBAccess.execute('SELECT COUNT(*) AS count FROM store_info', []).then(function(res) {
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


    /* Sync Inventory */
    $scope.syncInventory = function() {
        $scope.timeout = 0;
        backdrop.show();
        $scope.$watch('timeout', function(val) {
            if (val == 1) {
                backdrop.hide();
                Toast.show("Inventory sync successful");
            } else if (val == -1) {
                backdrop.hide();
                Toast.show("Unable to connect to server");
            }
        });

        /*  Get all Inventory data */
        Inventory.get({ id: store_id, path: 'inventory' }, function(res) {
            $scope.timeout++;
            angular.forEach(res, function(value) {
                var iid = value.id;
                DBAccess.execute("SELECT * FROM inventory WHERE _id = ?", [iid]).then(function(res) {
                    if (res.length == 0) {
                        var query = "INSERT INTO inventory (_id, name, uom, initial_qty, category_id, category_name, production_uom, production_convertion_qty, status, created) VALUES (?,?,?,?,?,?,?,?,?,?)";
                        var param = [value.id, value.item, value.inventory_uom, value.initial_qty, value.category.id, value.category.name, value.production_uom, value.production_quantity, value.status, dateFormatter.utc(new Date())];
                        DBAccess.execute(query, param);
                    } else {
                        var query = "UPDATE inventory SET name = ?, uom = ?, initial_qty = ?, category_id = ?, category_name = ?, production_uom = ?, production_convertion_qty = ?, status = ?, created = ? WHERE _id = ?";
                        var param = [value.item, value.inventory_uom, value.initial_qty, value.category.id, value.category.name, value.production_uom, value.production_quantity, value.status, dateFormatter.utc(new Date()), value.id];
                        DBAccess.execute(query, param);
                    }
                }, function(err) {
                    Log.write(err);
                });
            });
        }, function(err) {
            $scope.timeout = -1;
            Log.write(err);
        });
    };

    /* Sync Warehouse Approved Order Request */
    $scope.syncWarehouseAOR = function() {
        SyncData.fetch({ param1: store_id, param2: 'commissary', param3: 'order' }, function(res) {
            var warehouseApprovedOrderRequest = res;
            angular.forEach(warehouseApprovedOrderRequest, function(value) {
                var query = "SELECT id FROM warehouse_transaction WHERE transaction_number = ?";
                DBAccess.execute(query, [value.transaction_number]).then(function(res) {
                    if (res.length == 0) {
                        var selectEmployee = "SELECT id FROM employee WHERE username = ?";
                        /* 
                            Fetch ID from employee table 
                        */
                        DBAccess.execute(selectEmployee, [value.created_by_name]).then(function(res) {;
                            var id = res[0].id;
                            var insertWarehouseTransaction = "INSERT INTO warehouse_transaction (type, transaction_number, created_by, status, created, is_synced) VALUES (?,?,?,?,?,?)";
                            var param = ['order_commissary', value.transaction_number, id, value.status, value.created, 1];
                            var items = value.items;
                            /*
                                Insert warehouse transaction
                            */
                            DBAccess.execute(insertWarehouseTransaction, param).then(function(res) {
                                /* 
                                    Transaction ID from insert transaction 
                                */
                                $scope.tid = res.insertId;
                                angular.forEach(items, function(value) {
                                    value.tid = $scope.tid;
                                    var selectId = "SELECT id FROM inventory WHERE _id = ?";
                                    DBAccess.execute(selectId, [value.item_id]).then(function(res) {
                                        $scope.inventory_id = res[0].id;
                                        /* 
                                            API From backend should return the actual quantity 
                                        */
                                        var insertWarehouseRequest = "INSERT INTO warehouse_request (item_id, approved_quantity, transaction_id) VALUES (?,?,?)";
                                        var param = [$scope.inventory_id, value.qty == null ? 0 : value.qty, value.tid];
                                        DBAccess.execute(insertWarehouseRequest, param);
                                    }, function(err) {
                                        Log.write(err);
                                    });
                                });
                            }, function(err) {
                                Log.write(err);
                            });
                        }, function(err) {
                            Log.write(err);
                        });
                    } else {
                        value.tid = res[0].id;
                        console.log(value);
                    }
                }, function(err) {
                    Log.write(err);
                });
            });
        }, function(err) {
            Log.write(err);
        });
    };
}]);