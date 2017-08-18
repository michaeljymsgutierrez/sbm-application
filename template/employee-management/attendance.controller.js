'use strict';

/* Attendance Controller */

app.controller('attendanceCtrl', function($scope, Modal, ModalService, $q, $element) {

    /* Function for Taking Photo */
    $scope.takePhoto = function() {
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

        $scope.capture = function() {
            console.log("Ready to capture");
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