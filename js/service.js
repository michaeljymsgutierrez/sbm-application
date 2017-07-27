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


/* Service for validating API url and Key */
app.service('validateApi', function($resource) {
    /* validate endpoint */
    this.connect = function(strAPI) {
        return $resource(strAPI, {}, {
            'get': {
                method: 'GET',
                isArray: false,
                interceptor: {
                    response: function(response) {
                        return response;
                    }
                }
            }
        });
    };

    /* validate key */
    this.key = function(strAPI, strKey) {
        return $resource(strAPI, {}, {
            'get': {
                method: 'GET',
                headers: { 'api-key': strKey },
                isArray: true,
                interceptor: {
                    response: function(response) {
                        return response;
                    }
                }
            }
        });
    };
});