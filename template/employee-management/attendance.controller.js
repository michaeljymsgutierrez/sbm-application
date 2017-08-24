'use strict';

/* Attendance Controller */

app.controller('attendanceCtrl', function($rootScope, $scope, Modal, ModalService, DBAccess, $q, $filter, dateFormatter, Toast) {

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
        /* Check if employee exists in database */
        $scope.verifyEmployee($scope.username, $scope.employee_id);
        /* Listen for broadcasted event and determine the schedule */
        $rootScope.$on('attendance_verification', function(event, data) {
            if (data.length == 1) {
                var dateSearch = dateFormatter.standardNoTime(new Date()) + " 00:00:00";
                var timein_value = dateFormatter.standard(new Date());

                var query = "SELECT * FROM employee_schedule WHERE date = ? AND employee_id = ?";
                DBAccess.execute(query, [dateSearch, $scope.employee_id]).then(function(res) {
                    angular.forEach(res, function(value) {
                        var start = dateFormatter.standard(value.start);
                        var end = dateFormatter.standard(value.end);
                        if (dateFormatter.timestamp(timein_value) >= dateFormatter.timestamp(start) && dateFormatter.timestamp(timein_value) <= dateFormatter.timestamp(end)) {
                            $scope.schedule = value;
                        } else if (dateFormatter.timestamp(timein_value) >= (dateFormatter.timestamp(start) - 3600) && dateFormatter.timestamp(timein_value) <= dateFormatter.timestamp(end)) {
                            $scope.schedule = value;
                        }
                    });

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
                            DBAccess.execute(insert, param).then(function(res) {
                                /* attendance_id entry */
                                var attendance_id = res.insertId;
                                /* Execute here attendance_time_log entry timein action */

                            }, function(err) {
                                Log.write(err);
                            });
                        } else {
                            /* Execute here attendance verification and entry on attendance_time_log */
                        }
                    }, function(err) {
                        Log.write(err);
                    });

                    // console.log(sched_id);
                    // console.log(data);

                }, function(err) {
                    Log.write(err);
                });
            } else {
                $scope.username = '', $scope.employee_id = '';
                Toast.show('Employee not found or inactive');
            }
        });


    };

});