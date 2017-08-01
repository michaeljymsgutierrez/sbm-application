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
        jQuery('.custom-backdrop').show();
    };
    /* hide backdrop */
    this.hide = function() {
        jQuery('.custom-backdrop').hide();
    };
    /* show and hide backdrop within duration  */
    this.auto = function(duration) {
        jQuery('.custom-backdrop').show();
        $timeout(function() {
            jQuery('.custom-backdrop').hide();
        }, duration);
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
        return $filter('date')(dt, 'yyyy-MM-dd HH:mm:ss');
    }

    /* standard utc */
    this.utc = function(dt) {
        var raw_date = new Date(dt);
        var date_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
        return $filter('date')(date_utc, 'yyyy-MM-dd HH:mm:ss');
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