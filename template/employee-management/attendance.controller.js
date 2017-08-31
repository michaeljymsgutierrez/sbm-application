'use strict';

/* Attendance Controller */

app.controller('attendanceCtrl', function($rootScope, Log, $scope, Modal, ModalService, DBAccess, $q, $filter, dateFormatter, Toast) {

    /* Function for Taking Photo */
    $scope.takePhoto = function() {
        $scope.videoVisible = true;
        $scope.canvasVisible = false;

        /* Check if media devices exists */
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
                var src = window.URL.createObjectURL(stream);
                var video = document.getElementById('video');
                video.src = src;
            });
        }

        /* Function for closing take photo modal */
        $scope.cancel = function() {
            Modal.hide();
        };

        /* Function for reinitializing canvas draw */
        $scope.retakePhoto = function() {
            $scope.videoVisible = true;
            $scope.canvasVisible = false;
        };

        /* Function for drawing image on canvas from video */
        $scope.capture = function() {
            $scope.videoVisible = false;
            $scope.canvasVisible = true;
            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');
            var video = document.getElementById('video');
            context.drawImage(video, 0, 0, 568, 450);
        };

        /* Functionf or saving captured photo */
        $scope.save = function() {
            $scope.mugshot = canvas.toDataURL();
            Modal.hide();
        }

        /* Show take photo modal */
        ModalService.showModal({
            templateUrl: "./template/employee-management/take-photo.html",
            controller: "attendanceCtrl",
            scope: $scope
        }).then(function(modal) {
            modal.element.modal();
        });
    };


    /* 
        Function for checking username, employee_id and photo 
        Reuse this function for initiating ng-class erorr
    */
    $scope.checkFormInputs = function() {

        /* Execute erorr class for username */
        if (!$scope.username) {
            $scope.user_class = true;
        } else {
            $scope.user_class = false;
        }

        /* Execute class for employee_id  */
        if (!$scope.employee_id) {
            $scope.eid_class = true;
        } else {
            $scope.eid_class = false;
        }

        /* Excute  class for take photo */
        if (!$scope.mugshot) {
            $scope.photo_class = true;
        } else {
            $scope.photo_class = false;
        }

        /* Checker when to execute attendance action */
        if (!$scope.employee_id || !$scope.mugshot || !$scope.username) {
            $scope.executeAttendance = 0;
        } else {
            $scope.executeAttendance = 1;
        }
    };

    /* Simple function for clearning input models  */
    $scope.clearModels = function() {
        $scope.username = '', $scope.employee_id = '', $scope.mugshot = '';
    };

    /* 
        Function for verifying employee if exists 
        Broadcast data for listeners
    */
    $scope.verifyEmployee = function(uname, eid) {
        var query = "SELECT * FROM employee WHERE username = ? AND employee_id = ? AND active = 1";
        DBAccess.execute(query, [uname, eid]).then(function(res) {
            $rootScope.$broadcast('attendance_verification', res);
        }, function(err) {
            Log.write(err);
        });
    };


    /*
        Function for attendance Timein
        Functions: verifyEmployee(), checkFormInputs()
    */
    $scope.timein = function() {
        /* Check if forms is empty */
        $scope.checkFormInputs();
        if ($scope.executeAttendance == 1) {
            /* Check if employee exists in database */
            $scope.verifyEmployee($scope.username, $scope.employee_id);
            /* Listen for broadcasted event and determine the schedule */
            var unregisterTimein = $rootScope.$on('attendance_verification', function(event, data) {
                unregisterTimein();
                if (data.length == 1) {
                    var dateSearch = dateFormatter.standardNoTime(new Date()) + " 00:00:00";
                    var timein_value = dateFormatter.standard(new Date());

                    var query = "SELECT * FROM employee_schedule WHERE employee_id = ?";
                    DBAccess.execute(query, [$scope.employee_id]).then(function(res) {
                            angular.forEach(res, function(value) {
                                var start = dateFormatter.standard(value.start);
                                var end = dateFormatter.standard(value.end);
                                if (dateFormatter.timestamp(timein_value) >= dateFormatter.timestamp(start) && dateFormatter.timestamp(timein_value) < dateFormatter.timestamp(end)) {
                                    $scope.schedule = value;
                                } else if (dateFormatter.timestamp(timein_value) >= (dateFormatter.timestamp(start) - 3600) && dateFormatter.timestamp(timein_value) <= dateFormatter.timestamp(end)) {
                                    $scope.schedule = value;
                                }
                            });

                            /* Check wether the user has schedule before execution of timein action */
                            if ($scope.schedule != undefined) {
                                /* username , employee_id and schedule_id */
                                var username = data[0].username;
                                var eid = data[0].employee_id;
                                var sched_id = $scope.schedule._id;
                                var query = "SELECT * FROM attendance WHERE username = ? AND schedule_id = ?";

                                /* 
                                    Insert entry on attendance table if entry does not exist 
                                    Insert entry on attendance_time_log action timein
                                */
                                DBAccess.execute(query, [username, sched_id]).then(function(res) {
                                        if (res.length == 0) {
                                            var insert = "INSERT INTO attendance (schedule_id, username, employee_id, is_synced, is_completed) VALUES (?,?,?,?,?)";
                                            var param = [sched_id, username, eid, 0, 0];
                                            /* Insert First Timein action */
                                            DBAccess.execute(insert, param).then(function(res) {
                                                    /* attendance_id entry */
                                                    var attendance_id = res.insertId;
                                                    var query = "SELECT * FROM attendance_time_log WHERE attendance_id = ? AND action = 'timein'";
                                                    DBAccess.execute(query, [attendance_id]).then(function(res) {
                                                            if (res.length == 0) {
                                                                /* Insert here timein action */
                                                                var insertTimein = "INSERT INTO attendance_time_log (attendance_id, mugshot, filename, action, created) VALUES (?,?,?,?,?)";
                                                                var entry = {
                                                                    id: attendance_id,
                                                                    photo: $scope.mugshot.replace('data:image/png;base64,', ''),
                                                                    filename: username + dateFormatter.timestamp(new Date()) + '.png',
                                                                    action: 'timein',
                                                                    created: dateFormatter.utc(new Date())
                                                                }
                                                                var param = [entry.id, entry.photo, entry.filename, entry.action, entry.created];
                                                                DBAccess.execute(insertTimein, param);
                                                                $scope.clearModels();
                                                                Toast.show('You have timed in');
                                                            }
                                                        },
                                                        function(err) {
                                                            Log.write(err);
                                                        });
                                                },
                                                function(err) {
                                                    Log.write(err);
                                                });
                                        } else {
                                            /* 
                                                Fallback if user try to time in again
                                                Clear models and show toast                                    
                                            */
                                            $scope.clearModels();
                                            Toast.show('Time out is required to continue time in action');
                                        }
                                    },
                                    function(err) {
                                        Log.write(err);
                                    });
                            } else {
                                $scope.clearModels();
                                Toast.show('Employee schedule not found. Please check employee schedule.');
                            }
                        },
                        function(err) {
                            Log.write(err);
                        });
                } else {
                    $scope.clearModels();
                    Toast.show('Employee not found or inactive');
                }
            });
        }
    };

    /*
        Function for attendance Breakout
        Functions: checkFormInputs(), verifyEmployee()
    */
    $scope.breakout = function() {
        /* Check if forms is empty */
        $scope.checkFormInputs();
        if ($scope.executeAttendance == 1) {
            /* Check if employee exists in database */
            $scope.verifyEmployee($scope.username, $scope.employee_id);
            /* Listen for broadcasted event and determine the schedule */
            var unregisterBreakout = $rootScope.$on('attendance_verification', function(event, data) {
                unregisterBreakout();
                if (data.length == 1) {
                    var dateSearch = dateFormatter.standardNoTime(new Date()) + " 00:00:00";
                    var breakout_value = dateFormatter.standard(new Date());

                    var query = "SELECT * FROM employee_schedule WHERE employee_id = ?";
                    DBAccess.execute(query, [$scope.employee_id]).then(function(res) {
                        angular.forEach(res, function(value) {
                            var start = dateFormatter.standard(value.start);
                            var end = dateFormatter.standard(value.end);
                            if (dateFormatter.timestamp(breakout_value) > dateFormatter.timestamp(start) && dateFormatter.timestamp(breakout_value) < dateFormatter.timestamp(end)) {
                                $scope.schedule = value;
                            }
                        });

                        /* Check wether the user has schedule before execution of breakout action */
                        if ($scope.schedule != undefined) {
                            /* username , employee_id and schedule_id */
                            var username = data[0].username;
                            var eid = data[0].employee_id;
                            var sched_id = $scope.schedule._id;
                            var query = "SELECT * FROM attendance WHERE username = ? AND schedule_id = ?";


                            /* 
                                Insert entry on attendance table if entry does not exist 
                                Insert entry on attendance_time_log action breakout
                            */
                            DBAccess.execute(query, [username, sched_id]).then(function(res) {
                                if (res.length == 1) {
                                    var attendance_id = res[0].id;
                                    var query = "SELECT * FROM attendance_time_log WHERE attendance_id = ? AND action = 'breakout'";
                                    DBAccess.execute(query, [attendance_id]).then(function(res) {
                                        if (res.length == 0) {
                                            /* Insert here break out action */
                                            var insertBreakout = "INSERT INTO attendance_time_log (attendance_id, mugshot, filename, action, created) VALUES (?,?,?,?,?)";
                                            var entry = {
                                                id: attendance_id,
                                                photo: $scope.mugshot.replace('data:image/png;base64,', ''),
                                                filename: username + dateFormatter.timestamp(new Date()) + '.png',
                                                action: 'breakout',
                                                created: dateFormatter.utc(new Date())
                                            }
                                            var param = [entry.id, entry.photo, entry.filename, entry.action, entry.created];
                                            DBAccess.execute(insertBreakout, param);
                                            $scope.clearModels();
                                            Toast.show('Your break starts');
                                        } else {
                                            /* 
                                                Fallback if user try to break out again
                                                Clear models and show toast                                    
                                            */
                                            $scope.clearModels();
                                            Toast.show('You are already out for break');
                                        }
                                    }, function(err) {
                                        Log.write(err);
                                    });
                                } else {
                                    $scope.clearModels();
                                    Toast.show('Timein is required to contiue break out action');
                                }
                            }, function(err) {
                                Log.write(err);
                            });
                        } else {
                            $scope.clearModels();
                            Toast.show('Employee schedule not found. Please check employee schedule.');
                        }
                    }, function(err) {
                        Log.write(err);
                    });
                } else {
                    $scope.clearModels();
                    Toast.show('Employee not found or incative');
                }
            });
        }
    };


    /*
        Function for attendance Breakin
        Functions: checkFormInputs(), verifyEmployee()
    */
    $scope.breakin = function() {
        /* Check if forms is empty */
        $scope.checkFormInputs();
        if ($scope.executeAttendance == 1) {
            /* Check if employee exists in database */
            $scope.verifyEmployee($scope.username, $scope.employee_id);
            /* Listen for broadcasted event and determine the schedule */
            var unregisterBreakin = $rootScope.$on('attendance_verification', function(event, data) {
                unregisterBreakin();
                if (data.length == 1) {
                    var dateSearch = dateFormatter.standardNoTime(new Date()) + " 00:00:00";
                    var breakin_value = dateFormatter.standard(new Date());

                    var query = "SELECT * FROM employee_schedule WHERE employee_id = ?";
                    DBAccess.execute(query, [$scope.employee_id]).then(function(res) {
                        angular.forEach(res, function(value) {
                            var start = dateFormatter.standard(value.start);
                            var end = dateFormatter.standard(value.end);
                            if (dateFormatter.timestamp(breakin_value) > dateFormatter.timestamp(start) && dateFormatter.timestamp(breakin_value) < dateFormatter.timestamp(end)) {
                                $scope.schedule = value;
                            }
                        });

                        /* Check wether the user has schedule before execution of breakin action */
                        if ($scope.schedule != undefined) {
                            /* username , employee_id and schedule_id */
                            var username = data[0].username;
                            var eid = data[0].employee_id;
                            var sched_id = $scope.schedule._id;
                            var query = "SELECT * FROM attendance WHERE username = ? AND schedule_id = ?";


                            /* 
                                Insert entry on attendance table if entry does not exist 
                                Insert entry on attendance_time_log action breakin
                            */
                            DBAccess.execute(query, [username, sched_id]).then(function(res) {
                                if (res.length == 1) {
                                    var attendance_id = res[0].id;
                                    var query = "SELECT * FROM attendance_time_log WHERE attendance_id = ? AND action = 'breakin'";
                                    DBAccess.execute(query, [attendance_id]).then(function(res) {
                                        if (res.length == 0) {
                                            /* Insert here break in action */
                                            var insertBreakin = "INSERT INTO attendance_time_log (attendance_id, mugshot, filename, action, created) VALUES (?,?,?,?,?)";
                                            var entry = {
                                                id: attendance_id,
                                                photo: $scope.mugshot.replace('data:image/png;base64,', ''),
                                                filename: username + dateFormatter.timestamp(new Date()) + '.png',
                                                action: 'breakin',
                                                created: dateFormatter.utc(new Date())
                                            }
                                            var param = [entry.id, entry.photo, entry.filename, entry.action, entry.created];
                                            DBAccess.execute(insertBreakin, param);
                                            $scope.clearModels();
                                            Toast.show('Your break ends');
                                        } else {
                                            /* 
                                                Fallback if user try to break in again
                                                Clear models and show toast                                    
                                            */
                                            $scope.clearModels();
                                            Toast.show('Your break already ended');
                                        }
                                    }, function(err) {
                                        Log.write(err);
                                    });
                                } else {
                                    /* 
                                        Fallback if user try to break in again
                                        Clear models and show toast                                    
                                    */
                                    $scope.clearModels();
                                    Toast.show('Break in required to continue break out action');
                                }
                            }, function(err) {
                                Log.write(err);
                            });
                        } else {
                            $scope.clearModels();
                            Toast.show('Employee schedule not found. Please check employee schedule.');
                        }
                    }, function(err) {
                        Log.write(err);
                    });
                } else {
                    $scope.clearModels();
                    Toast.show('Employee not found or inactive');
                }
            });
        }
    };


    /*
        Function for attendance Timeout
        Functions: checkFormInputs(), verifyEmployee()
    */
    $scope.timeout = function() {
        /* Check if forms is empty */
        $scope.checkFormInputs();
        if ($scope.executeAttendance == 1) {
            /* Check if employee exists in database */
            $scope.verifyEmployee($scope.username, $scope.employee_id);
            /* Listen for broadcasted event and determine the schedule */
            var unregisterTimein = $rootScope.$on('attendance_verification', function(event, data) {
                unregisterTimein();
                if (data.length == 1) {
                    var dateSearch = dateFormatter.standardNoTime(new Date()) + " 00:00:00";
                    var timeout_value = dateFormatter.standard(new Date());

                    var query = "SELECT * FROM employee_schedule WHERE date = ? AND employee_id = ?";
                    DBAccess.execute(query, [dateSearch, $scope.employee_id]).then(function(res) {
                        angular.forEach(res, function(value) {
                            var start = dateFormatter.standard(value.start);
                            var end = dateFormatter.standard(value.end);
                            if (dateFormatter.timestamp(timeout_value) > dateFormatter.timestamp(value.start) && dateFormatter.timestamp(timeout_value) <= dateFormatter.timestamp(value.end)) {
                                $scope.schedule = value;
                            } else if (dateFormatter.timestamp(timeout_value) > dateFormatter.timestamp(value.start) && dateFormatter.timestamp(timeout_value) <= (dateFormatter.timestamp(value.end) + 3600)) {
                                $scope.schedule = value;
                            }
                        });

                        /* Check wether the user has schedule before execution of timeout action */
                        if ($scope.schedule != undefined) {
                            /* username , employee_id and schedule_id */
                            var username = data[0].username;
                            var eid = data[0].employee_id;
                            var sched_id = $scope.schedule._id;
                            var query = "SELECT * FROM attendance WHERE username = ? AND schedule_id = ?";

                            /* 
                                    Insert entry on attendance table if entry does not exist 
                                    Insert entry on attendance_time_log action timeout
                            */
                            DBAccess.execute(query, [username, sched_id]).then(function(res) {
                                if (res.length == 1) {
                                    // 
                                } else {
                                    $scope.clearModels();
                                    // Toast.show('Timein is required to contiue break out action');
                                }
                            }, function(err) {
                                Log.write(err);
                            })
                        } else {
                            $scope.clearModels();
                            Toast.show('Employee schedule not found. Please check employee schedule.');
                        }
                    }, function(err) {
                        Log.write(err);
                    });
                } else {
                    $scope.clearModels();
                    Toast.show('Employee not found or inactive');
                }
            });
        }
    };

});