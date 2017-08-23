'use strict';

/*  Main application module */
var app = angular.module('bms', ['ui.router', 'ngResource', 'ds.clock', 'angularModalService']);
/* Initialize mysql driver */
var mysql = require('mysql');
/* Intialize connection  database connection */
var connection = null;

/* Put all your configuration here */
app.run(function($state, DBAccess, Log) {

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
        }
    });

    connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'bms_db'
    });

    /* Create store_info table */
    var store_info = "CREATE TABLE IF NOT EXISTS store_info (id INT PRIMARY KEY AUTO_INCREMENT, store_id INT, store_code VARCHAR(25), store_name VARCHAR(25), company VARCHAR(25), location VARCHAR(25), bank  VARCHAR(25))";
    DBAccess.execute(store_info, []).then(function(res) {
        console.info('store_info table created');
    }, function(err) {
        Log.write(err);
    });

    /* Create branch_info table */
    var branch_info = "CREATE TABLE IF NOT EXISTS branch_info (id INT PRIMARY KEY AUTO_INCREMENT, _id INT, store_name VARCHAR(25))";
    DBAccess.execute(branch_info, []).then(function(res) {
        console.info('branch_info table created');
    }, function(err) {
        Log.write(err);
    });

    /* Create reason  table */
    var reason = "CREATE TABLE IF NOT EXISTS reason (id INT PRIMARY KEY AUTO_INCREMENT, _id INT, module VARCHAR(25), reason VARCHAR(25))";
    DBAccess.execute(reason, []).then(function(res) {
        console.info("reason table created");
    }, function(err) {
        Log.write(err);
    });

    /* Create employee table */
    var employee = "CREATE TABLE IF NOT EXISTS employee (id INT PRIMARY KEY AUTO_INCREMENT, employee_id VARCHAR(25), user_id VARCHAR(25), name VARCHAR(25), username VARCHAR(25), role VARCHAR(25), active VARCHAR(25), created DATETIME)";
    DBAccess.execute(employee, []).then(function(res) {
        console.info("employee table created");
    }, function(err) {
        Log.write(err);
    });

    /* Create employee schedule table */
    var employee_schedule = "CREATE TABLE IF NOT EXISTS employee_schedule (id INT PRIMARY KEY AUTO_INCREMENT, _id INT, employee_id VARCHAR(25), date DATETIME, shift VARCHAR(255), start DATETIME, end DATETIME, branch_id VARCHAR(25))";
    DBAccess.execute(employee_schedule, []).then(function(res) {
        console.info("employee_schedule table created");
    }, function(err) {
        Log.write(err);
    });

    /* Create attendance table */
    var attendance = "CREATE TABLE IF NOT EXISTS attendance (id INT PRIMARY KEY AUTO_INCREMENT, schedule_id INT, username VARCHAR(25), employee_id VARCHAR(25), is_synced INT, is_completed INT)";
    DBAccess.execute(attendance, []).then(function(res) {
        console.info("attendance table created");
    }, function(err) {
        Log.write(err);
    });
});