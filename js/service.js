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


/* Service for validating API url */
app.service('validateApi', function($resource) {
    this.connect = function(strAPI) {
        return $resource(strAPI, {}, {
            'get': {
                method: 'GET',
                isArray: false
            }
        });
    }
});