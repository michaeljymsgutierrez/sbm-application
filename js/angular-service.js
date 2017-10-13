'use strict';

/* Include all services */


/* Service for accessing localStorage */
app.service('storage', ['$window', function($window) {
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
}]);


/* Service for logging file to txt */
app.service('Log', [function() {
    this.write = function(msg) {
        var fs = require('fs');
        fs.appendFileSync('log.txt', "\n" + new Date() + ":" + msg);
    };
}]);


/* Service for toast notification */
app.service('Toast', ['$timeout', function($timeout) {
    this.show = function(msg) {
        var toast = jQuery('#snackbar');
        toast.text(msg);
        toast.addClass('show');
        $timeout(function() {
            toast.removeClass('show');
        }, 3000);
    };
}]);


/* Service for showing backdrop */
app.service('backdrop', ['$timeout', function($timeout) {
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
}]);

/* Service for angular modal service hider */
app.service('Modal', ['ModalService', function(ModalService) {
    this.hide = function() {
        ModalService.closeModals();
        jQuery('.modal-backdrop').remove();
        jQuery('.modal').remove();
    };
}]);

/* Service for formatting date */
app.service('dateFormatter', ['$filter', function($filter) {
    /* month */
    this.month = function(dt) {
        return $filter('date')(dt, 'MMM');
    };

    /* date */
    this.date = function(dt) {
        return $filter('date')(dt, 'dd');
    };

    /* year */
    this.year = function(dt) {
        return $filter('date')(dt, 'yyyy');
    };

    /* standard format */
    this.standard = function(dt) {
        return $filter('date')(dt, 'yyyy-MM-dd HH:mm:00');
    };

    /* date now 24 format */
    this.now = function() {
        return $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:00');
    };

    /* standard utc */
    this.utc = function(dt) {
        var raw_date = new Date(dt);
        var date_utc = new Date(raw_date.getUTCFullYear(), raw_date.getUTCMonth(), raw_date.getUTCDate(), raw_date.getUTCHours(), raw_date.getUTCMinutes(), raw_date.getUTCSeconds());
        /*
            $filter('date')(date_utc, 'yyyy-MM-dd HH:mm:ss');
            Use this if require localtime 24Format to UTC
        */
        return $filter('date')(date_utc, 'yyyy-MM-dd HH:mm:00');
    };

    /* standard format no time */
    this.standardNoTime = function(dt) {
        return $filter('date')(dt, 'yyyy-MM-dd');
    };

    /* string format */
    this.stringDate = function(dt) {
        return $filter('date')(dt, 'MMMM d, y');
    };

    /* convert datetime to timestamp */
    this.timestamp = function(dt) {
        return Math.floor(new Date(dt).getTime() / 1000);
    };

    /* convert timestamp to regular date */
    this.fromTimestamp = function(dt) {
        return new Date(dt * 1000);
    };

    /* format date to slash */
    this.slashFormat = function(dt) {
        return $filter('date')(dt, 'MM/d/yyyy');
    };
}]);


/* Service for Executing DB Queries */
app.service('DBAccess', ['$q', function($q) {
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
}]);


/* Service for popping and verifying username */
app.service('Username', ['ModalService', function(ModalService) {
    /* Function for popup modal username */
    this.popup = function() {
        ModalService.showModal({
            templateUrl: './template/directive-template/username-prompt.html',
            controller: 'usernameCtrl'
        }).then(function(modal) {
            modal.element.modal();
        });
    };
}]);


/* Service for popping calendar */
app.service('Calendar', ['ModalService', function(ModalService) {
    /* Function for popup modal calendar */
    this.popup = function() {
        ModalService.showModal({
            templateUrl: './template/directive-template/calendar.html',
            controller: 'calendarCtrl'
        }).then(function(modal) {
            modal.element.modal();
        });
    };
}]);


/* Service for transitioninig route with delay*/
app.service('Transition', ['$state', '$timeout', function($state, $timeout) {
    this.go = function(route) {
        $timeout(function() {
            $state.go(route);
        }, 1000);
    };
}]);


/* Service for number key pad */
app.service('NumberPad', ['ModalService', function(ModalService) {
    this.show = function() {
        ModalService.showModal({
            templateUrl: './template/directive-template/number-pad.html',
            controller: 'numberPadCtrl'
        }).then(function(modal) {
            modal.element.modal();
        });
    };
}]);


/* Service for reason */
app.service('Reasons', ['ModalService', function(ModalService) {
    this.show = function() {
        ModalService.showModal({
            templateUrl: './template/directive-template/reason.html',
            controller: 'reasonCtrl'
        }).then(function(modal) {
            modal.element.modal();
        });
    };
}]);

/* Removed _ from string */
app.filter('remove_', function() {
    return function(input) {
        return input.replace('_', ' ');
    };
});

/* Service for transaction flilter popup */
app.service('TransactionFilter', ['ModalService', function(ModalService) {
    this.show = function() {
        ModalService.showModal({
            templateUrl: './template/directive-template/transaction-filter.html',
            controller: 'transactionFilterCtrl'
        }).then(function(modal) {
            modal.element.modal();
        });
    };
}]);

/* Service for general modal item popup */
app.service('ItemModal', ['ModalService', function(ModalService) {
    this.show = function(path, ctrl) {
        console.log(path + " " + ctrl);
        ModalService.showModal({
            templateUrl: path,
            controller: ctrl
        }).then(function(modal) {
            modal.element.modal();
        });
    };
}]);