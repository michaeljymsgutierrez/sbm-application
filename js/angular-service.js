'use strict';

/* Include all services */


/* Service for accessing localStorage */
app.service('storage', function($window) {
    /* write fn */
    this.write = function(key, val) {
        var value = angular.toJson(val);
        $window.localStorage.setItem(key, value);
    };

    /* read fn */
    this.read = function(key) {
        var value = JSON.parse($window.localStorage.getItem(key));
        return value;
    };
});


/* Service for logging file to txt */
app.service('Log', function() {
    this.write = function(msg) {
        var fs = require('fs');
        fs.appendFileSync('log.txt', "\n" + new Date() + ":" + msg);
    }
});


/* Service for toast notification */
app.service('Toast', function($timeout) {
    this.show = function(msg) {
        var toast = jQuery('#snackbar');
        toast.text(msg);
        toast.addClass('show');
        $timeout(function() {
            toast.removeClass('show');
        }, 3000);
    }
});


/* Service for showing backdrop */
app.service('backdrop', function($timeout) {
    /* show backdrop */
    this.show = function() {
        jQuery('.custom-backdrop').css({ 'visibility': 'visible' });
    };
    /* hide backdrop */
    this.hide = function() {
        jQuery('.custom-backdrop').css({ 'visibility': 'hidden' });
    };
    /* show and hide backdrop within duration  */
    this.auto = function(duration) {
        jQuery('.custom-backdrop').css({ 'visibility': 'visible' });
        $timeout(function() {
            jQuery('.custom-backdrop').css({ 'visibility': 'hidden' });
        }, duration);
    };
});

/* Service for angular modal service hider */
app.service('Modal', function(ModalService) {
    this.hide = function() {
        ModalService.closeModals();
        jQuery('.modal-backdrop').remove();
        jQuery('.modal').remove();
    };
});

/* Service for formatting date */
app.service('dateFormatter', function($filter) {
    /* month */
    this.month = function(dt) {
        return $filter('date')(dt, 'MMM');
    }

    /* date */
    this.date = function(dt) {
        return $filter('date')(dt, 'dd');
    }

    /* year */
    this.year = function(dt) {
        return $filter('date')(dt, 'yyyy');
    }

    /* standard format */
    this.standard = function(dt) {
        return $filter('date')(dt, 'yyyy-MM-dd HH:mm:00');
    }

    /* date now 24 format */
    this.now = function() {
        return $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:00');
    }

    /* standard utc */
    this.utc = function(dt) {
        var raw_date = new Date(dt);
        var date_utc = new Date(raw_date.getUTCFullYear(), raw_date.getUTCMonth(), raw_date.getUTCDate(), raw_date.getUTCHours(), raw_date.getUTCMinutes(), raw_date.getUTCSeconds());
        /*
            $filter('date')(date_utc, 'yyyy-MM-dd HH:mm:ss');
            Use this if require localtime 24Format to UTC
        */
        return $filter('date')(date_utc, 'yyyy-MM-dd HH:mm:00');
    }

    /* standard format no time */
    this.standardNoTime = function(dt) {
        return $filter('date')(dt, 'yyyy-MM-dd');
    }

    /* string format */
    this.stringDate = function(dt) {
        return $filter('date')(dt, 'MMMM d, y');
    }

    /* convert datetime to timestamp */
    this.timestamp = function(dt) {
        return Math.floor(new Date(dt).getTime() / 1000);
    }
});


/* Service for Executing DB Queries */
app.service('DBAccess', function($q) {
    /* Param must be array */
    this.execute = function(query, param) {
        var deferred = $q.defer();
        var response;
        connection.query(query, param, function(err, res, fields) {
            if (err) {
                var response = err;
                deferred.reject(response);
            } else {
                var response = res;
                deferred.resolve(response);
            }
        });
        return deferred.promise;
    };

    /* Terminate connection */
    this.terminate = function() {
        connection.end();
    };
});


/* Service for popping and verifying username */
app.service('Username', function(ModalService) {
    /* Function for popup modal username */
    this.popup = function() {
        ModalService.showModal({
            templateUrl: './template/directive-template/username-prompt.html',
            controller: 'usernameCtrl'
        }).then(function(modal) {
            modal.element.modal();
        });
    };
});