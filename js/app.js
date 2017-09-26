'use strict';

/*  Main application module */
var app = angular.module('bms', ['ui.router', 'ngResource', 'ds.clock', 'angularModalService', 'mp.datePicker']);
/* Initialize mysql driver */
var mysql = require('mysql');
/* Intialize connection  database connection */
var connection = null;
/* 
    Fade Effect on load view
*/
var fadeOnLoadView = function() {
    $('body').css({ 'opacity': 0 });
    setTimeout(function() {
        $('body').animate({
            'opacity': 1,
            'transition': '2s ease-in'
        }, 5000);
    }, 1000);
};

/* Put all your configuration here */
app.run(['$state', 'DBAccess', 'Log', function($state, DBAccess, Log) {

    // fadeOnLoadView();

    connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
    });

    /* Intialize database */
    connection.query('CREATE DATABASE IF NOT EXISTS bms_db', function(err, res, fields) {
        if (err) {
            console.error(err);
        } else {
            console.info('DB created');
            initDB();
        }
    });

    /*
        Initialize Database and Tables
    */
    var initDB = function() {

        connection = mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'bms_db'
        });

        /* Create store_info table */
        var store_info = "CREATE TABLE IF NOT EXISTS store_info (id INT PRIMARY KEY AUTO_INCREMENT, store_id INT, store_code VARCHAR(255), store_name VARCHAR(255), company VARCHAR(255), location VARCHAR(255), bank  VARCHAR(255))";
        DBAccess.execute(store_info, []).then(function(res) {
            console.info('store_info table created');
        }, function(err) {
            Log.write(err);
        });

        /* Create branch_info table */
        var branch_info = "CREATE TABLE IF NOT EXISTS branch_info (id INT PRIMARY KEY AUTO_INCREMENT, _id INT, store_name VARCHAR(255))";
        DBAccess.execute(branch_info, []).then(function(res) {
            console.info('branch_info table created');
        }, function(err) {
            Log.write(err);
        });

        /* Create reason  table */
        var reason = "CREATE TABLE IF NOT EXISTS reason (id INT PRIMARY KEY AUTO_INCREMENT, _id INT, module VARCHAR(255), reason VARCHAR(255))";
        DBAccess.execute(reason, []).then(function(res) {
            console.info("reason table created");
        }, function(err) {
            Log.write(err);
        });

        /* Create employee table */
        var employee = "CREATE TABLE IF NOT EXISTS employee (id INT PRIMARY KEY AUTO_INCREMENT, employee_id VARCHAR(255), user_id VARCHAR(255), name VARCHAR(255), username VARCHAR(255), role VARCHAR(255), active VARCHAR(255), created DATETIME)";
        DBAccess.execute(employee, []).then(function(res) {
            console.info("employee table created");
        }, function(err) {
            Log.write(err);
        });

        /* Create employee schedule table */
        var employee_schedule = "CREATE TABLE IF NOT EXISTS employee_schedule (id INT PRIMARY KEY AUTO_INCREMENT, _id INT, employee_id VARCHAR(255), date DATETIME, shift VARCHAR(255), start DATETIME, end DATETIME, branch_id VARCHAR(255))";
        DBAccess.execute(employee_schedule, []).then(function(res) {
            console.info("employee_schedule table created");
        }, function(err) {
            Log.write(err);
        });

        /* Create attendance table */
        var attendance = "CREATE TABLE IF NOT EXISTS attendance (id INT PRIMARY KEY AUTO_INCREMENT, schedule_id INT, username VARCHAR(255), employee_id VARCHAR(255), is_synced INT, is_completed INT)";
        DBAccess.execute(attendance, []).then(function(res) {
            console.info("attendance table created");
        }, function(err) {
            Log.write(err);
        });

        /* Create attendance timelog table */
        var attendance_timelog = "CREATE TABLE IF NOT EXISTS attendance_time_log (attendance_id INT, mugshot LONGTEXT, filename VARCHAR(255), action VARCHAR(255), created DATETIME)";
        DBAccess.execute(attendance_timelog, []).then(function(res) {
            console.info("attendance_time_log table created");
        }, function(err) {
            Log.write(err);
        });

        /* Create inventory table */
        var inventory = "CREATE TABLE IF NOT EXISTS inventory (id INT PRIMARY KEY AUTO_INCREMENT, _id INT, name VARCHAR(255), uom VARCHAR(255), initial_qty VARCHAR(255), category_id VARCHAR(255), category_name VARCHAR(255), production_uom VARCHAR(255), production_convertion_qty VARCHAR(255), status INT, created DATETIME)";
        DBAccess.execute(inventory, []).then(function(res) {
            console.info("inventory table created");
        }, function(err) {
            Log.write(err);
        });

        /* Create inventory_beginning table */
        var inventory_beginning = "CREATE TABLE IF NOT EXISTS inventory_beginning (id INT PRIMARY KEY AUTO_INCREMENT, inventory_id INT, qty INT, created_by VARCHAR(255),created DATETIME, is_synced INT)";
        DBAccess.execute(inventory_beginning, []).then(function(res) {
            console.info("inventory_beginning table created");
        }, function(err) {
            Log.write(err);
        });

        /* Create inventory_actual table */
        var inventory_actual = "CREATE TABLE IF NOT EXISTS inventory_actual (id INT PRIMARY KEY AUTO_INCREMENT, inventory_id INT, qty INT, created_by VARCHAR(255),created DATETIME, is_synced INT)";
        DBAccess.execute(inventory_actual, []).then(function(res) {
            console.info("inventory_actual table created");
        }, function(err) {
            Log.write(err);
        });

        /* Create inventory_waste table */
        var inventory_waste = "CREATE TABLE IF NOT EXISTS inventory_waste (id INT PRIMARY KEY AUTO_INCREMENT, inventory_id INT, qty INT, created DATETIME, is_synced INT, reason LONGTEXT)";
        DBAccess.execute(inventory_waste, []).then(function(res) {
            console.info("inventory_waste table created");
        }, function(err) {
            Log.write(err);
        });
    };
}]);