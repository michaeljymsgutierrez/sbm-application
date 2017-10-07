'use strict';

/* Include all API service */

/* Get API information */
var api = {
    endpoint: JSON.parse(window.localStorage.getItem('endpoint')),
    key: JSON.parse(window.localStorage.getItem('apiKey'))
};

/* Service for validating API url and Key */
app.service('validateApi', ['$resource', function($resource) {
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
}]);

/* Store Information */
app.service('Store', ['$resource', 'storage', function($resource, storage) {
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
}]);

/* Branch Information */
app.service('Branch', ['$resource', function($resource) {
    return $resource(api.endpoint + '/store/:id/branch', { id: '@id' }, {
        'get': {
            method: 'GET',
            headers: { 'api-key': api.key },
            isArray: true,
            interceptor: function(response) {
                return response;
            }
        }
    });
}]);

/* Reasons data */
app.service('Reason', ['$resource', function($resource) {
    return $resource(api.endpoint + '/store/:id/reasons', { id: '@id' }, {
        'get': {
            method: 'GET',
            headers: { 'api-key': api.key },
            isArray: true,
            interceptor: function(response) {
                return response;
            }
        }
    });
}]);

/* Employee Data and Schedule */
app.service('Employee', ['$resource', function($resource) {
    return $resource(api.endpoint + '/store/:id/:path/:path2', { id: '@id', path: '@path', path2: '@path2' }, {
        'get': {
            method: 'GET',
            headers: { 'api-key': api.key },
            isArray: true,
            interceptor: function(response) {
                return response;
            }
        }
    });
}]);

/* Inventory Data */
app.service('Inventory', ['$resource', function($resource) {
    return $resource(api.endpoint + "/store/:id/:path/:path2", { id: '@id', path: '@path', path2: '@path2' }, {
        'get': {
            method: 'GET',
            headers: { 'api-key': api.key },
            isArray: true,
            interceptor: function(response) {
                return response;
            }
        }
    });
}]);

/* 
    General Service for Sync
    Method: POST
*/
app.service('SyncData', ['$resource', function($resource) {
    return $resource(api.endpoint + '/store/:param1/:param2/:param3', { param1: '@param1', param2: '@param2', param3: '@param3' }, {
        'send': {
            method: 'POST',
            headers: { 'api-key': api.key },
            isArray: false,
            interceptor: function(response) {
                return response;
            }
        },
        'fetch': {
            method: 'GET',
            headers: { 'api-key': api.key },
            isArray: true,
            interceptor: function(response) {
                return response;
            }
        }
    });
}]);


/*
    Service for SyncInventory
    With Custom Response due to lack of proper response
*/
app.service('SyncInventory', ['$http', '$q', function($http, $q) {
    this.send = function(id, data) {
        var deferred = $q.defer();
        $http({
            url: api.endpoint + '/store/' + id + '/inventory',
            method: 'POST',
            headers: { 'api-key': api.key },
            data: { data: data }
        }).then(function(res) {
            if (res.status == 200 && res.statusText == 'OK') {
                deferred.resolve(res.config.data.data);
            }
        }, function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };
}]);


/*
    Service for Sync Warehouse Transaction Numbers
*/
app.service('WarehouseTN', ['$http', '$q', function($http, $q) {
    this.send = function(id, data) {
        var deferred = $q.defer();
        $http({
            url: api.endpoint + '/store/' + id + '/commissary/order',
            method: 'POST',
            headers: { 'api-key': api.key },
            data: { transaction_numbers: data }
        }).then(function(res) {
            if (res.status == 200 && res.statusText == 'OK') {
                deferred.resolve(res.config.data.data);
            }
        }, function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };
}]);