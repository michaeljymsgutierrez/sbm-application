'use strict';

/* Attendance Controller */

app.controller('attendanceCtrl', function($scope) {

    /* Function for Taking Photo */
    $scope.takePhoto = function() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
                var src = window.URL.createObjectURL(stream);
            });
        }
    };

});