'use strict';

/* Attendance Controller */

app.controller('attendanceCtrl', function($scope, Modal, ModalService, $q, $element) {

    /* Function for Taking Photo */
    $scope.takePhoto = function() {

        $scope.videoVisible = true;
        $scope.canvasVisible = false;

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
                var src = window.URL.createObjectURL(stream);
                var video = document.getElementById('video');
                video.src = src;
            });
        }

        $scope.closeMe = function() {
            Modal.hide();
        };

        $scope.retakePhoto = function() {
            $scope.videoVisible = true;
            $scope.canvasVisible = false;
        };

        $scope.capture = function() {
            $scope.videoVisible = false;
            $scope.canvasVisible = true;
            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');
            var video = document.getElementById('video');
            context.drawImage(video, 0, 0, 568, 450);
        };

        ModalService.showModal({
            templateUrl: "./template/employee-management/take-photo.html",
            controller: "attendanceCtrl",
            scope: $scope
        }).then(function(modal) {
            modal.element.modal();
        });
    };

});