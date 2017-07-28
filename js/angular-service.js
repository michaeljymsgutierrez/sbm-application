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
app.service('backdrop', function() {
    this.show = function() {
        jQuery('.custom-backdrop').show();
    }
    this.hide = function() {
        jQuery('.custom-backdrop').hide();
    }
});


/* Service for Executing DB Queries */
app.service('DBAccess', function() {
    /* Param must be array */
    this.execute = function(query, param) {
        if (param) {
            connection.query(query, param, function(err, res, fields) {
                if (err) {
                    return err;
                } else {
                    return res;
                }
            });
        } else {
            connection.query(query, function(err, res, fields) {
                if (err) {
                    return err;
                } else {
                    return res;
                }
            });
        }
    }
});