'use strict';

/*  Main application module */
var app = angular.module('bms', ['ui.router', 'ngResource']);
/* Initialize mysql driver */
var mysql = require('mysql');
/* Intialize connection  database connection */
var connection = null;

/* Put all your configuration here */
app.run(function($state, DBAccess) {

    connection = mysql.createConnection({
        host: 'localhost',
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
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'bms_db'
    });

    /* Create store_info table */
    var store_info = "CREATE TABLE IF NOT EXISTS store_info (id INT PRIMARY KEY AUTO_INCREMENT, store_id INT, store_code VARCHAR(25), store_name VARCHAR(25), company VARCHAR(25), location VARCHAR(25), bank  VARCHAR(25))";
    DBAccess.execute(store_info, []).then(function(res) {
        console.info('store_info table created');
    }, function(err) {
        console.error(err);
    });

    /* Create branch_info table */
    var branch_info = "CREATE TABLE IF NOT EXISTS branch_info (id INT PRIMARY KEY AUTO_INCREMENT, _id INT, store_name VARCHAR(25))";
    DBAccess.execute(branch_info, []).then(function(res) {
        console.log('branch_info table created');
    }, function(err) {
        console.log(err);
    });

});