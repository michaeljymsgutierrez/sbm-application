'use strict';

/* Include all API service */

/* Get API information */
var api = {
    endpoint: JSON.parse(window.localStorage.getItem('endpoint')),
    key: JSON.parse(window.localStorage.getItem('apiKey'))
};

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

/* Store Information */
app.service('Store', function($resource, storage) {
    return $resource(api.endpoint + '/store/:id', { id: '@id' }, {
        'get': {
            method: 'GET',
            headers: { 'api-key': api.key },
            isArray: false,
            interceptor: function(response) {
                return response;
            }
        }
    });
});